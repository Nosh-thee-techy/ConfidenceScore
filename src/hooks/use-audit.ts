'use client';

import { useState, useCallback } from 'react';
import { runAuditAction } from '@/app/actions/audit';
import { AuditReport } from '@/types/audit';

export function useAudit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  const runAudit = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = await runAuditAction(url);
      setReport(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Audit failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { runAudit, loading, error, report };
}
