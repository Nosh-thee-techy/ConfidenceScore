'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GapAnalysisProps {
  gap: string;
  variant?: 'default' | 'media';
}

function stripOuterQuotes(s: string): string {
  let t = s.trim();
  if (t.length >= 2) {
    const a = t[0];
    const b = t[t.length - 1];
    if ((a === '"' && b === '"') || (a === '\u201c' && b === '\u201d')) {
      t = t.slice(1, -1).trim();
    }
  }
  return t;
}

export function GapAnalysis({ gap, variant = 'default' }: GapAnalysisProps) {
  const body = stripOuterQuotes(gap);
  const paras = body.split(/\n\n+/).filter(Boolean);
  const accent = variant === 'media' ? 'violet' : 'emerald';

  return (
    <Card className="relative border-slate-800 bg-slate-900 group">
      <div
        className={cn(
          'absolute -inset-0.5 rounded-xl blur opacity-0 transition duration-500 group-hover:opacity-100',
          accent === 'violet' ? 'bg-violet-500/15' : 'bg-emerald-500/20',
        )}
      />
      <CardHeader className="relative border-b border-slate-800">
        <CardTitle
          className={cn(
            'flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]',
            accent === 'violet' ? 'text-violet-400' : 'text-emerald-500',
          )}
        >
          <Info className="h-4 w-4 shrink-0" /> Contextual gap
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-3 p-6">
        {paras.map((p, i) => (
          <p key={i} className="font-mono text-sm leading-relaxed text-slate-300">
            {p}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
