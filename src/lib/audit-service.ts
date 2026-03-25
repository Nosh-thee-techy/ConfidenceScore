import { GoogleGenAI, Type } from "@google/genai";
import type { AuditClaim, AuditReport, AuditSource } from "@/types/audit";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const MAX_OUTPUT_TOKENS = Math.min(
  16384,
  Math.max(2048, parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? "8192", 10) || 8192),
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

const AUDIT_SYSTEM_INSTRUCTION = `You are the Confidence Score CS-Index engine: a careful forensic analyst for news integrity, not a hot-take generator.

Depth rules (non-negotiable):
- Produce 6–10 distinct atomic claims. Each claim is ONE checkable proposition (who did what, when, how much, which law/policy). Split compound sentences.
- For EVERY claim, the explanation must be 3–5 sentences: (1) what evidence would confirm or falsify it, (2) what is missing from the submission, (3) common ways this kind of claim goes wrong (misdated stats, wrong institution, cropped quote, missing geography), (4) your epistemic stance — say when you cannot verify without primary documents or the full article body.
- summary: 6–10 sentences as an executive brief: bottom-line integrity posture, who is harmed if wrong, what the public should do next (e.g. check official gazette, regulator circular, original broadcast), and how the score was reasoned (completeness vs sourcing vs internal consistency).
- contextualGap: 5–8 sentences. Name specific omitted context: counter-narratives, baseline statistics, timeline, jurisdiction, conflicts of interest, or who was not quoted. Avoid generic phrases like "more research needed" without naming what research.
- sources: 7–12 rows. Prefer real, stable URLs (government regulators, UN agencies, major outlets, statutes). If you cannot name a real URL, use a Neutral row pointing to a reputable methodology page (e.g. fact-checking or statistical literacy) — never fabricate a fake news article URL. Tag each Supporting, Refuting, or Neutral honestly.
- score 0–100: penalize missing context, unsourced numbers, emotional framing without evidence, and contradictions between claims. Reward transparent hedging and alignment with documented facts when the text allows.

Kenya & East Africa: when relevant, weigh CBK, KNBS, IEBC, KRA, ODPC, Parliament, county governments, and reputable regional outlets. Do not invent press releases or quotes.

If the user only pasted a URL and no article text: you cannot fetch the page. Say so explicitly in summary and contextualGap; infer only cautious hypotheses from the URL path/domain and mark substantive claims Unsubstantiated until the body is available.

Output MUST be a single JSON object matching the schema. No markdown outside JSON.`;

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    claims: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          status: {
            type: Type.STRING,
            enum: ["Verified", "Inconsistent", "Unsubstantiated"],
          },
          explanation: { type: Type.STRING },
        },
        required: ["text", "status", "explanation"],
      },
    },
    contextualGap: { type: Type.STRING },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING },
          title: { type: Type.STRING },
          relevance: {
            type: Type.STRING,
            enum: ["Supporting", "Refuting", "Neutral"],
          },
        },
        required: ["url", "title", "relevance"],
      },
    },
  },
  required: ["score", "summary", "claims", "contextualGap", "sources"],
} as const;

function isLikelyQuotaError(err: unknown): boolean {
  const s = err instanceof Error ? err.message : String(err);
  return (
    s.includes("429") ||
    s.includes("RESOURCE_EXHAUSTED") ||
    s.includes("quota") ||
    s.includes("Quota exceeded") ||
    s.includes("rate limit")
  );
}

function hashScore(query: string): number {
  let h = 0;
  for (let i = 0; i < query.length; i++) h = (Math.imul(31, h) + query.charCodeAt(i)) | 0;
  return 28 + (Math.abs(h) % 58);
}

function claimStatusesFromIndex(i: number, score: number): AuditClaim["status"] {
  if (score < 40) return i % 3 === 0 ? "Inconsistent" : "Unsubstantiated";
  if (score < 65) return i % 2 === 0 ? "Unsubstantiated" : "Verified";
  return i % 4 === 0 ? "Unsubstantiated" : "Verified";
}

function splitQueryIntoClaimSeeds(query: string): string[] {
  const chunks = query
    .split(/[\n\r]+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  const out = chunks.slice(0, 8);
  if (out.length >= 3) return out;
  return [
    query.slice(0, 220) + (query.length > 220 ? "…" : ""),
    "Implied causal link between events or actors in the submission",
    "Numeric or dated factual assertions (time, place, amount, mandate)",
    "Attribution: who is said to have said or decided what",
    "Stakeholder impact and missing counter-voices",
    "Jurisdiction and which institution would hold authoritative records",
  ];
}

function mockAuditReport(query: string): AuditReport {
  const score = hashScore(query);
  const seeds = splitQueryIntoClaimSeeds(query);
  const claims: AuditClaim[] = seeds.map((text, i) => ({
    text: text.length > 280 ? `${text.slice(0, 277)}…` : text,
    status: claimStatusesFromIndex(i, score),
    explanation: [
      "Without the primary document, broadcast, or dataset, this proposition should be treated as pending.",
      "A full CS-Index pass would cross-check regulator circulars, Hansard, or outlet archives; none are available in demo mode.",
      "Forwards and headlines often drop dates and geography — confirm both before sharing.",
      "If this touches public funds or elections, prioritize first-party portals (e.g. gazette, IEBC, CBK) over screenshots.",
    ].join(" "),
  }));

  const sources: AuditSource[] = [
    {
      title: "Gemini API — quotas & rate limits",
      url: "https://ai.google.dev/gemini-api/docs/rate-limits",
      relevance: "Neutral",
    },
    {
      title: "Africa Check — how we fact-check",
      url: "https://africacheck.org/about-us/how-we-fact-check/",
      relevance: "Supporting",
    },
    {
      title: "UNESCO — journalism, fake news and disinformation",
      url: "https://www.unesco.org/en/fake-news",
      relevance: "Neutral",
    },
    {
      title: "Kenya Law Reports",
      url: "https://new.kenyalaw.org/",
      relevance: "Supporting",
    },
    {
      title: "Central Bank of Kenya — official publications",
      url: "https://www.centralbank.go.ke/",
      relevance: "Neutral",
    },
    {
      title: "IEBC Kenya — information centre",
      url: "https://www.iebc.or.ke/",
      relevance: "Neutral",
    },
    {
      title: "KNBS — official statistics",
      url: "https://www.knbs.or.ke/",
      relevance: "Supporting",
    },
  ];

  const short = query.length > 100 ? `${query.slice(0, 97)}…` : query;

  return {
    id: Math.random().toString(36).substring(7).toUpperCase(),
    url: query,
    score,
    summary: [
      `This is an offline demo report (API quota, network, or missing key) — the layout mirrors a full CS-Index run.`,
      `Input summarized: “${short}”.`,
      `In live mode, the model expands each line into sourced reasoning, gap analysis, and a calibrated 0–100 integrity score.`,
      `For your pitch, explain that demo mode preserves the product story while billing or rate windows catch up.`,
      `Judges should still see multi-claim decomposition, institutional source rows, and explicit epistemic limits — the same contract as production.`,
    ].join(" "),
    claims,
    contextualGap: [
      `Demo mode cannot access the full article body, video frames, or WhatsApp thread — those are exactly where omission and manipulation hide.`,
      `A production pass would require: exact publication date, author/byline, primary quotes, datasets behind charts, and whether Kenyan regulators have issued a relevant circular.`,
      `Without that, scores are illustrative only; do not treat demo outputs as verified journalism.`,
    ].join(" "),
    sources,
    isDemo: true,
  };
}

export async function auditArticle(query: string): Promise<AuditReport> {
  const isUrl = query.startsWith("http");
  const userMessage = `INPUT TYPE: ${isUrl ? "URL or link (you do not have the fetched page unless text is pasted below)" : "Plaintext claim, forward, or pasted article excerpt"}.

SUBMISSION:
"""
${query}
"""

Return the JSON audit now. Remember: 6–10 claims, long explanations, 7–12 sources, rich summary and contextualGap.`;

  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.warn("auditArticle: no GEMINI_API_KEY, using demo report");
    return mockAuditReport(query);
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: userMessage,
      config: {
        systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: reportSchema as unknown as Record<string, unknown>,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.45,
      },
    });

    const data = JSON.parse(response.text || "{}") as Partial<AuditReport>;
    let claims = Array.isArray(data.claims)
      ? data.claims.filter((c) => c?.text && c?.status && c?.explanation)
      : [];
    let sources = Array.isArray(data.sources) ? data.sources : [];

    if (claims.length < 5) {
      console.warn(`auditArticle: only ${claims.length} claims; model may have been truncated`);
    }

    if (claims.length === 0) {
      claims = [
        {
          text: query.slice(0, 220) + (query.length > 220 ? "…" : ""),
          status: "Unsubstantiated",
          explanation:
            "The model returned no structured claims — possibly output truncation. Retry with a shorter input or increase quota. Treat every atomic proposition in the submission as needing manual verification against primary sources.",
        },
      ];
    }

    if (sources.length < 5) {
      sources = [
        ...sources,
        {
          title: "How to read fact-checks — methodology",
          url: "https://africacheck.org/about-us/how-we-fact-check/",
          relevance: "Neutral" as const,
        },
        {
          title: "UNESCO — media and information literacy",
          url: "https://www.unesco.org/en/media-information-literacy",
          relevance: "Neutral" as const,
        },
      ];
    }

    return {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      url: query,
      score:
        typeof data.score === "number" && !Number.isNaN(data.score)
          ? Math.max(0, Math.min(100, Math.round(data.score)))
          : 50,
      summary: typeof data.summary === "string" ? data.summary : "",
      claims,
      contextualGap: typeof data.contextualGap === "string" ? data.contextualGap : "",
      sources,
      isDemo: false,
    };
  } catch (err) {
    if (isLikelyQuotaError(err)) {
      console.warn("auditArticle: API quota/rate limit — demo fallback");
    } else {
      console.error("auditArticle:", err);
    }
    return mockAuditReport(query);
  }
}
