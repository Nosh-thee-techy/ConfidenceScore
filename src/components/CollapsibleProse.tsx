'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CollapsibleProseProps {
  text: string;
  /** Characters before showing expand (default 520). */
  collapseAt?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
}

/** Long model prose: readable preview + expand, optional paragraph split on blank lines. */
export function CollapsibleProse({
  text,
  collapseAt = 520,
  className,
  moreLabel = 'Read full brief',
  lessLabel = 'Show less',
}: CollapsibleProseProps) {
  const [open, setOpen] = React.useState(false);
  const trimmed = text.trim();
  const needsCollapse = trimmed.length > collapseAt;
  const display = !needsCollapse || open ? trimmed : `${trimmed.slice(0, collapseAt).trim()}…`;

  const paragraphs = display.split(/\n\n+/).filter(Boolean);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-3 text-sm leading-relaxed text-slate-400">
        {paragraphs.map((p, i) => (
          <p key={i} className="font-mono text-[13px] leading-[1.65]">
            {p}
          </p>
        ))}
      </div>
      {needsCollapse && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 font-mono text-[10px] uppercase tracking-widest text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown className={cn('mr-1 h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
          {open ? lessLabel : moreLabel}
        </Button>
      )}
    </div>
  );
}
