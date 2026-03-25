'use client';

import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { useSearchParams, useParams } from 'next/navigation';
import {
  Shield,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Share2,
  Search,
  ChevronDown,
  ChevronUp,
  FileJson,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreRing } from '@/components/ScoreRing';
import { GapAnalysis } from '@/components/GapAnalysis';
import { ClaimsList } from '@/components/ClaimsList';
import { PermanentSeal } from '@/components/PermanentSeal';
import { useAudit } from '@/hooks/use-audit';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { VerdictCard } from '@/components/VerdictCard';
import { MediaIntegrityPanel } from '@/components/MediaIntegrityPanel';
import { CollapsibleProse } from '@/components/CollapsibleProse';
import { parseChannel, type IntakeChannel } from '@/lib/intake-channels';
import {
  shareAuditReport,
  exportReportJson,
  exportReportMarkdown,
} from '@/lib/report-share';

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><ReportSkeleton /></div>}>
      <ReportContent />
    </Suspense>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const query = searchParams.get('query') || searchParams.get('url'); // Fallback to url for backward compatibility
  const reportId = params.id as string;
  const channel: IntakeChannel = parseChannel(searchParams.get('channel'));

  const { runAudit, report, loading, error } = useAudit();
  const [angazaExpanded, setAngazaExpanded] = React.useState(false);

  const showFullReport = channel !== 'angaza' || angazaExpanded;

  React.useEffect(() => {
    if (query) {
      runAudit(query);
    }
  }, [query, runAudit]);

  React.useEffect(() => {
    setAngazaExpanded(false);
  }, [query, channel]);

  const channelBadge =
    channel === 'angaza'
      ? 'Angaza / WhatsApp'
      : channel === 'media'
        ? 'Media intake'
        : 'Web · full CS-Index';

  if (!query) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Search className="w-16 h-16 text-slate-800 mb-4" />
        <h2 className="text-2xl font-mono uppercase tracking-widest text-slate-400">No Query Provided</h2>
        <p className="text-slate-600 mt-2 font-mono">Please enter a URL or claim on the home page to begin audit.</p>
        <Link href="/">
          <Button variant="outline" className="mt-6 border-slate-800 hover:bg-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="text-sm font-mono font-bold tracking-tighter uppercase hidden sm:block">Confidence Score</span>
          </div>
          <Badge variant="outline" className="border-slate-800 text-slate-500 font-mono text-[10px]">
            {channelBadge}
          </Badge>
          <Badge variant="outline" className="hidden border-slate-800 text-slate-600 font-mono text-[10px] sm:inline-flex">
            ID: {reportId}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-800 text-xs font-mono uppercase tracking-widest"
            disabled={!report}
            onClick={() => report && void shareAuditReport(report)}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-800 text-xs font-mono uppercase tracking-widest"
            disabled={!report}
            onClick={() => report && exportReportJson(report, reportId)}
          >
            <FileJson className="mr-2 h-4 w-4" /> JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-800 text-xs font-mono uppercase tracking-widest"
            disabled={!report}
            onClick={() =>
              report &&
              exportReportMarkdown(report, {
                reportId,
                query: query ?? '',
                channel,
              })
            }
          >
            <FileText className="mr-2 h-4 w-4" /> Markdown
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {report?.isDemo && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-mono text-sm text-amber-100/95">
            <span className="text-[10px] uppercase tracking-widest text-amber-400">Demo mode</span>
            <p className="mt-1 text-amber-100/80">
              Gemini returned quota/rate limits or the key is missing — showing a sample report so your hackathon demo still works. Add billing or wait, then refresh.
            </p>
          </div>
        )}
        {loading ? (
          <ReportSkeleton />
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-mono uppercase">Audit Failed</h2>
            <p className="text-slate-400 max-w-md mx-auto">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry Audit</Button>
          </div>
        ) : report ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {channel === 'angaza' && (
              <div className="lg:col-span-12 space-y-4">
                <VerdictCard report={report} />
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-700 font-mono text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-emerald-400"
                    onClick={() => setAngazaExpanded((v) => !v)}
                  >
                    {angazaExpanded ? (
                      <ChevronUp className="mr-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    )}
                    {angazaExpanded ? 'Hide full CS-Index' : 'Open full CS-Index report'}
                  </Button>
                </div>
              </div>
            )}
            {showFullReport && channel === 'media' && (
              <div className="lg:col-span-12">
                <MediaIntegrityPanel query={query ?? ''} />
              </div>
            )}
            {showFullReport && (
              <>
            {/* Left Column: Metrics & Summary */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="overflow-hidden border-slate-800 bg-slate-900">
                <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                  <CardTitle className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                    {channel === 'media' ? 'Narrative integrity' : 'Integrity metric'}
                  </CardTitle>
                  {channel === 'media' ? (
                    <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-violet-400/80">
                      Text and filename pass · pixel forensics not attached
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 p-8">
                  <ScoreRing
                    score={report.score}
                    centerLabel={channel === 'media' ? 'Score' : 'Confidence'}
                    sublabel={
                      channel === 'media'
                        ? 'Narrative audit only'
                        : undefined
                    }
                  />
                  <PermanentSeal />
                  <div className="w-full border-t border-slate-800/80 pt-6 text-left">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      Executive brief
                    </p>
                    <CollapsibleProse
                      text={report.summary}
                      collapseAt={channel === 'media' ? 480 : 640}
                      moreLabel="Read full brief"
                    />
                  </div>
                </CardContent>
              </Card>

              <GapAnalysis gap={report.contextualGap} variant={channel === 'media' ? 'media' : 'default'} />
            </div>

            {/* Right Column: Claims & Sources */}
            <div className="lg:col-span-8 space-y-8">
              <ClaimsList claims={report.claims} idPrefix={channel === 'media' ? 'M' : 'CS'} />

              {/* Source Citation Table */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800">
                  <CardTitle className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Source Citations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-900/50">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-[10px] font-mono uppercase tracking-widest py-4">Source Title</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-widest py-4">Relevance</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-widest py-4 text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.sources.map((source, i) => (
                          <TableRow key={i} className="border-slate-800 hover:bg-slate-800/30">
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-300">{source.title}</span>
                                <span className="text-[10px] font-mono text-slate-600 truncate max-w-[200px]">{source.url}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                "text-[10px] font-mono uppercase tracking-widest border-none",
                                source.relevance === 'Supporting' ? "text-emerald-500 bg-emerald-500/10" :
                                source.relevance === 'Refuting' ? "text-rose-500 bg-rose-500/10" :
                                "text-slate-500 bg-slate-500/10"
                              )}>
                                {source.relevance}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <a href={source.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-emerald-500">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
              </>
            )}
          </motion.div>
        ) : null}
      </main>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-4 space-y-8">
        <Skeleton className="h-[400px] w-full bg-slate-900 rounded-xl" />
        <Skeleton className="h-[150px] w-full bg-slate-900 rounded-xl" />
      </div>
      <div className="lg:col-span-8 space-y-8">
        <Skeleton className="h-[500px] w-full bg-slate-900 rounded-xl" />
        <Skeleton className="h-[300px] w-full bg-slate-900 rounded-xl" />
      </div>
    </div>
  );
}
