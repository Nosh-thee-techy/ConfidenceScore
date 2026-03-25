import type { AuditReport } from '@/types/audit';

export function verdictLabelFromScore(score: number): string {
  if (score < 35) return 'Low trust';
  if (score < 55) return 'Weak / unclear';
  if (score < 75) return 'Mixed signals';
  return 'Stronger integrity';
}

export function buildShareText(report: AuditReport, pageUrl?: string): string {
  const label = verdictLabelFromScore(report.score);
  const url =
    pageUrl ?? (typeof window !== 'undefined' ? window.location.href : '');
  const summary =
    report.summary.length > 200 ? `${report.summary.slice(0, 200)}…` : report.summary;
  return `Confidence Score · ${Math.round(report.score)}/100 — ${label}\n${summary}\n${url}`;
}

export async function shareAuditReport(report: AuditReport): Promise<void> {
  const text = buildShareText(report);
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: 'Confidence Score', text });
      return;
    }
  } catch {
    /* fall through */
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  }
}

function triggerDownload(filename: string, mime: string, body: string) {
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportReportJson(report: AuditReport, reportId: string) {
  const payload = {
    exportedAt: new Date().toISOString(),
    reportId,
    ...report,
  };
  triggerDownload(
    `confidence-score-${reportId}.json`,
    'application/json',
    JSON.stringify(payload, null, 2),
  );
}

export function exportReportMarkdown(
  report: AuditReport,
  meta: { reportId: string; query: string; channel: string },
) {
  const verifiedClaims = report.claims.filter((c) => c.status === 'Verified').length;
  const inconsistentClaims = report.claims.filter((c) => c.status === 'Inconsistent').length;
  const unsubstantiatedClaims = report.claims.filter((c) => c.status === 'Unsubstantiated').length;

  const supportingSources = report.sources.filter((s) => s.relevance === 'Supporting').length;
  const refutingSources = report.sources.filter((s) => s.relevance === 'Refuting').length;
  const neutralSources = report.sources.filter((s) => s.relevance === 'Neutral').length;

  const gapText = report.contextualGap.trim();
  const gapItems = gapText
    ? gapText.split(/\n+/).map((p) => p.trim()).filter(Boolean)
    : [];
  const gapCount = gapItems.length ? gapItems.length : gapText ? 1 : 0;

  const lines = [
    '# Confidence Score — CS-Index export',
    '',
    `- **Report ID:** ${meta.reportId}`,
    `- **Channel:** ${meta.channel}`,
    `- **Input:** ${meta.query}`,
    `- **Exported:** ${new Date().toISOString()}`,
    '',
    `## Score: ${Math.round(report.score)}/100`,
    '',
    '## Summary',
    '',
    report.summary,
    '',
    '## Contextual gap',
    '',
    report.contextualGap,
    '',
    '## Verification reviews (derived from engine output)',
    '',
    `- Step 1 — Deconstruct into atomic claims: ${report.claims.length} (Verified: ${verifiedClaims}, Inconsistent: ${inconsistentClaims}, Unsubstantiated: ${unsubstantiatedClaims})`,
    `- Step 2 — Complete picture benchmark (citations): ${report.sources.length} sources (Supporting: ${supportingSources}, Refuting: ${refutingSources}, Neutral/Method: ${neutralSources})`,
    `- Step 3 — Gap analysis notes: ${gapCount}`,
    report.isDemo ? '- Note: This report is in demo mode; primary documents were not fetched automatically.' : '',
    '',
    '## Claims',
    '',
    ...report.claims.flatMap((c) => [
      `### ${c.status}: ${c.text}`,
      '',
      c.explanation,
      '',
    ]),
    '## Sources',
    '',
    ...report.sources.flatMap((s) => [`- [${s.title}](${s.url}) — _${s.relevance}_`, '']),
  ];
  triggerDownload(
    `confidence-score-${meta.reportId}.md`,
    'text/markdown;charset=utf-8',
    lines.join('\n'),
  );
}
