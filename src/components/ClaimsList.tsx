'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuditClaim } from '@/types/audit';

const EXPLAIN_COLLAPSE = 320;

interface ClaimsListProps {
  claims: AuditClaim[];
  idPrefix?: string;
}

export function ClaimsList({ claims, idPrefix = 'CS' }: ClaimsListProps) {
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Audited claims</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-800">
          {claims.map((claim, i) => {
            const claimRef = `${idPrefix}-${String(i + 1).padStart(2, '0')}`;
            const long = claim.explanation.length > EXPLAIN_COLLAPSE;
            const isOpen = expanded[i];
            const explanationShown =
              !long || isOpen
                ? claim.explanation
                : `${claim.explanation.slice(0, EXPLAIN_COLLAPSE).trim()}…`;

            return (
              <motion.div
                key={claimRef}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.4) }}
                className="flex flex-col gap-4 p-6 transition-colors hover:bg-slate-800/50 sm:flex-row"
              >
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={claim.status} />
                    <span className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      {claimRef}
                    </span>
                  </div>
                  <p className="font-medium leading-snug text-slate-200">{claim.text}</p>
                  <div className="space-y-2">
                    <p className="font-mono text-xs leading-relaxed text-slate-500">{explanationShown}</p>
                    {long ? (
                      <button
                        type="button"
                        onClick={() => setExpanded((m) => ({ ...m, [i]: !m[i] }))}
                        className="font-mono text-[10px] uppercase tracking-widest text-violet-400/90 hover:text-violet-300"
                      >
                        {isOpen ? 'Collapse analysis' : 'Full analysis'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: AuditClaim['status'] }) {
  switch (status) {
    case 'Verified':
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 font-mono text-[10px] uppercase tracking-widest text-emerald-500">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
        </Badge>
      );
    case 'Inconsistent':
      return (
        <Badge className="border-amber-500/20 bg-amber-500/10 font-mono text-[10px] uppercase tracking-widest text-amber-500">
          <AlertTriangle className="mr-1 h-3 w-3" /> Inconsistent
        </Badge>
      );
    case 'Unsubstantiated':
      return (
        <Badge className="border-rose-500/20 bg-rose-500/10 font-mono text-[10px] uppercase tracking-widest text-rose-500">
          <AlertCircle className="mr-1 h-3 w-3" /> Unsubstantiated
        </Badge>
      );
  }
}
