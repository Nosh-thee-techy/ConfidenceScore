'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Database, Map, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import type { AuditReport } from '@/types/audit';
import { verdictLabelFromScore } from '@/lib/report-share';
import { MOCK_REGISTRY } from '@/lib/constants';
import { cn } from '@/lib/utils';

function safeExtractDomain(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./i, '').toLowerCase();
    return host || null;
  } catch {
    return null;
  }
}

function inferTopicFromText(text: string): { topic: string; coverageHint: number } {
  const t = text.toLowerCase();
  const topics: Array<{ topic: string; keywords: string[]; coverageHint: number }> = [
    { topic: 'Healthcare in Kenya', keywords: ['health', 'hospital', 'clinic', 'disease', 'medical'], coverageHint: 72 },
    { topic: 'Elections & governance', keywords: ['election', 'iebc', 'govern', 'parliament', 'mp', 'mp '], coverageHint: 70 },
    { topic: 'Economy & budgets', keywords: ['gdp', 'inflation', 'budget', 'cbk', 'tax', 'trade', 'rate'], coverageHint: 75 },
    { topic: 'Corruption & procurement', keywords: ['corruption', 'bribe', 'procurement', 'embezz', 'tender'], coverageHint: 66 },
    { topic: 'Climate & agriculture', keywords: ['climate', 'drought', 'farming', 'agriculture', 'harvest'], coverageHint: 64 },
  ];

  for (const item of topics) {
    if (item.keywords.some((k) => t.includes(k))) return { topic: item.topic, coverageHint: item.coverageHint };
  }

  return { topic: 'Cross-topic coverage map', coverageHint: 68 };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function EngineLayersBadges({ report, query }: { report: AuditReport; query: string }) {
  const label1 = verdictLabelFromScore(report.score);

  const domain = safeExtractDomain(report.url);
  const registryMatch =
    domain
      ? MOCK_REGISTRY.find((d) => d.domain === domain || domain.endsWith(`.${d.domain}`) || domain === d.domain)
      : undefined;

  const topicSource = query?.trim() ? query : report.url;
  const inferredTopic = inferTopicFromText(topicSource);
  // Demo-grade estimate: blend article confidence with a topic-specific hint.
  const layer3Coverage = clamp(Math.round(inferredTopic.coverageHint * 0.55 + report.score * 0.45), 0, 100);

  const layer2Tone =
    registryMatch?.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-500 bg-rose-500/10 border-rose-500/30';

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Three layers of the engine</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Layer badges summarize what’s been measured now, and what gets compounded over time in the registry + topic map.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
            CS-Index + Registry + Map
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Layer 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Layer 1 — Article Score</p>
                <p className="mt-2 text-sm font-mono font-bold text-slate-50">
                  {Math.round(report.score)}/100 <span className="text-slate-500">·</span> {label1}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
              Measures completeness + source quality. Gaps reduce confidence until the missing context is checked.
            </p>
          </div>

          {/* Layer 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Layer 2 — Publisher Registry</p>
                <p className="mt-2 text-sm font-mono font-bold text-slate-50">
                  {registryMatch ? `${registryMatch.score}/100` : 'Pending'}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <Database className="w-5 h-5 text-violet-400" />
              </div>
            </div>

            {registryMatch ? (
              <>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn('border border-solid font-mono text-[10px] uppercase tracking-widest', layer2Tone)}>
                    {registryMatch.trend === 'up' ? (
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Rising
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> Falling
                      </span>
                    )}
                  </Badge>
                  {registryMatch.verified ? (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                      VERIFIED
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-800 text-slate-500 bg-slate-900/20 font-mono text-[10px] uppercase tracking-widest">
                      UNVERIFIED
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
                  Publisher: <span className="text-slate-200">{registryMatch.domain}</span>. Registry data compounds trust over hundreds of audits.
                </p>
              </>
            ) : (
              <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
                Publisher not found in the registry dataset yet (demo). Use <span className="text-slate-200">/registry</span> to explore available domains.
              </p>
            )}
          </div>

          {/* Layer 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Layer 3 — Topic Trust Map</p>
                <p className="mt-2 text-sm font-mono font-bold text-slate-50">
                  {layer3Coverage}/100 <span className="text-slate-500">·</span> Coverage
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/40">
                <Map className="w-5 h-5 text-slate-300" />
              </div>
            </div>

            <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
              Topic: <span className="text-slate-200">{inferredTopic.topic}</span>. A complete map needs topic extraction + cross-publisher coverage statistics.
            </p>
            <div className="mt-3">
              <Badge variant="outline" className="border-slate-800 text-slate-500 bg-slate-900/20 font-mono text-[10px] uppercase tracking-widest">
                Demo estimate based on CS-Index
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

