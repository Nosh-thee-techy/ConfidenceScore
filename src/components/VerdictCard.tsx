'use client';

import { motion } from 'motion/react';
import { Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuditReport } from '@/types/audit';
import { cn } from '@/lib/utils';
import { verdictLabelFromScore, shareAuditReport } from '@/lib/report-share';

function verdictFromScore(score: number): { label: string; tone: 'rose' | 'amber' | 'emerald' } {
  const label = verdictLabelFromScore(score);
  if (score < 35) return { label, tone: 'rose' };
  if (score < 55) return { label, tone: 'amber' };
  if (score < 75) return { label, tone: 'amber' };
  return { label, tone: 'emerald' };
}

export function VerdictCard({ report }: { report: AuditReport }) {
  const { label, tone } = verdictFromScore(report.score);
  const toneRing =
    tone === 'rose'
      ? 'from-rose-500/40 to-rose-600/20'
      : tone === 'amber'
        ? 'from-amber-500/40 to-amber-600/20'
        : 'from-emerald-500/40 to-emerald-600/20';

  const share = () => shareAuditReport(report);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20"
    >
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-60 blur-sm',
          toneRing,
        )}
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
              Angaza · WhatsApp verdict card
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-slate-50">
              <span
                className={cn(
                  tone === 'rose' && 'text-rose-400',
                  tone === 'amber' && 'text-amber-400',
                  tone === 'emerald' && 'text-emerald-400',
                )}
              >
                {label}
              </span>
              <span className="text-slate-500"> — </span>
              <span>{Math.round(report.score)}</span>
              <span className="text-lg text-slate-500">/100</span>
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{report.summary}</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={share}
          className="shrink-0 bg-emerald-500 font-mono text-xs uppercase tracking-widest text-slate-950 hover:bg-emerald-400"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share card
        </Button>
      </div>
      <p className="relative mt-4 border-t border-slate-800 pt-4 text-center text-[10px] font-mono uppercase tracking-widest text-slate-600">
        Same CS-Index engine · shortened for mobile groups
      </p>
    </motion.div>
  );
}
