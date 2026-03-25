'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AuditReport } from '@/types/audit';
import { CheckCircle2, AlertTriangle, ClipboardList, BadgeCheck, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function splitIntoGapItems(text: string): string[] {
  const t = (text ?? '').trim();
  if (!t) return [];
  // Prefer paragraphs first; fallback to sentences.
  const paras = t.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  if (paras.length >= 3) return paras;

  const sentences = t
    .split(/(?<=[.!?])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length ? sentences : [t];
}

export function VerificationReviews({ report }: { report: AuditReport; query: string }) {
  const verifiedCount = report.claims.filter((c) => c.status === 'Verified').length;
  const inconsistentCount = report.claims.filter((c) => c.status === 'Inconsistent').length;
  const unsubstantiatedCount = report.claims.filter((c) => c.status === 'Unsubstantiated').length;

  const supportingCount = report.sources.filter((s) => s.relevance === 'Supporting').length;
  const refutingCount = report.sources.filter((s) => s.relevance === 'Refuting').length;
  const neutralCount = report.sources.filter((s) => s.relevance === 'Neutral').length;

  const gapItems = splitIntoGapItems(report.contextualGap);
  const gapPreview = gapItems.slice(0, 4);

  const step1Ready = report.claims.length >= 5;
  const step2Ready = report.sources.length >= 5;
  const step3Ready = report.contextualGap.trim().length >= 40;

  const riskScore = clamp(
    Math.round(
      // Demo-grade heuristic: more unsubstantiated claims implies higher review risk.
      (100 - report.score) * 0.55 + unsubstantiatedCount * 6 + refutingCount * 3,
    ),
    0,
    100,
  );

  const RiskBadge =
    riskScore < 35
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
      : riskScore < 60
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
        : 'border-rose-500/30 bg-rose-500/10 text-rose-500';

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
          Reviews & Verification (three-step engine)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {report.isDemo ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-mono text-sm text-amber-100/95">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase tracking-widest text-amber-300">Demo mode</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-amber-100/80">
              Primary documents and full article bodies are not fetched here. Treat verification steps as required before publication.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          {/* Step 1 */}
          <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Step 1 — Deconstruct the Article</p>
                  <p className="mt-1 text-sm font-mono text-slate-200">
                    {report.claims.length} atomic claim(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {step1Ready ? (
                  <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Ready
                  </Badge>
                ) : (
                  <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-500 font-mono text-[10px] uppercase tracking-widest">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 inline" /> Partial
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                Verified: {verifiedCount}
              </Badge>
              <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500 font-mono text-[10px] uppercase tracking-widest">
                Inconsistent: {inconsistentCount}
              </Badge>
              <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-500 font-mono text-[10px] uppercase tracking-widest">
                Unsubstantiated: {unsubstantiatedCount}
              </Badge>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Each claim includes an explanation of what would confirm/falsify it, plus what’s missing from the submitted text.
              Use <span className="text-slate-200">Audited claims</span> to expand and review.
            </p>
          </section>

          {/* Step 2 */}
          <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileSearch className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Step 2 — Build the “Complete Picture” Benchmark</p>
                  <p className="mt-1 text-sm font-mono text-slate-200">
                    {report.sources.length} source rows
                  </p>
                </div>
              </div>

              {step2Ready ? (
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Prepared
                </Badge>
              ) : (
                <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500 font-mono text-[10px] uppercase tracking-widest">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 inline" /> Needs more citations
                </Badge>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                Supporting: {supportingCount}
              </Badge>
              <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-500 font-mono text-[10px] uppercase tracking-widest">
                Refuting: {refutingCount}
              </Badge>
              <Badge className="border-slate-800 bg-slate-900/20 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                Neutral/Method: {neutralCount}
              </Badge>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              The benchmark is constructed from the available citations (and declared epistemic limits). Open
              <span className="text-slate-200"> Source Citations</span> to verify links and check whether primary records exist.
            </p>
          </section>

          {/* Step 3 */}
          <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Step 3 — Gap Analysis</p>
                  <p className="mt-1 text-sm font-mono text-slate-200">
                    {gapItems.length} gap note(s)
                  </p>
                </div>
              </div>

              {step3Ready ? (
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Covered
                </Badge>
              ) : (
                <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-500 font-mono text-[10px] uppercase tracking-widest">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 inline" /> Missing detail
                </Badge>
              )}
            </div>

            {gapPreview.length ? (
              <ul className="mt-3 space-y-2">
                {gapPreview.map((g, idx) => (
                  <li key={idx} className="text-xs leading-relaxed text-slate-300">
                    <span className="mr-2 text-slate-500 font-mono">{String(idx + 1).padStart(2, '0')}.</span>
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-slate-400">No gap text available in this report.</p>
            )}

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              The full contextual gap appears in the <span className="text-slate-200">Contextual gap</span> card.
            </p>
          </section>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Review risk estimate</p>
            <p className="text-sm font-mono text-slate-200">
              {riskScore}/100
              <span className="text-slate-500"> · </span>
              {riskScore < 35 ? 'Low' : riskScore < 60 ? 'Medium' : 'High'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('border font-mono text-[10px] uppercase tracking-widest', RiskBadge)}>
              Review before sharing
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

