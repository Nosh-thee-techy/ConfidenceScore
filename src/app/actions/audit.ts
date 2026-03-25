"use server";

import { auditArticle } from "@/lib/audit-service";

export async function runAuditAction(query: string) {
  return auditArticle(query);
}
