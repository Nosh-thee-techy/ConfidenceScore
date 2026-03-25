export interface AuditClaim {
  text: string;
  status: 'Verified' | 'Inconsistent' | 'Unsubstantiated';
  explanation: string;
}

export interface AuditSource {
  url: string;
  title: string;
  relevance: 'Supporting' | 'Refuting' | 'Neutral';
}

export interface AuditReport {
  id: string;
  url: string;
  score: number;
  summary: string;
  claims: AuditClaim[];
  contextualGap: string;
  sources: AuditSource[];
  /** True when the live API was skipped (quota, error, or missing key). */
  isDemo?: boolean;
}
