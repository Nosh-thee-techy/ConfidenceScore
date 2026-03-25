'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Clapperboard,
  ScanLine,
  Lock,
  Check,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function extractMediaFilename(query: string): string | null {
  const bracket = query.match(/\[Media context:\s*([^\]]+)\]/i);
  if (bracket?.[1]) return bracket[1].trim();
  const ext = query.match(/([\w\-]+\.(?:jpe?g|png|gif|webp|mp4|mov|webm))\b/i);
  return ext?.[1] ?? null;
}

export function looksLikeFilenameOnlyAudit(query: string): boolean {
  const t = query.trim();
  if (t.length < 200 && /\.(jpe?g|png|gif|webp|mp4|mov|webm)\b/i.test(t)) return true;
  if (/^\[Media context:[^\]]+\.(?:jpe?g|png|gif|webp|mp4)/i.test(t) && t.length < 280) return true;
  return false;
}

const PIPELINE = [
  {
    key: 'narrative',
    done: true,
    title: 'Narrative and claims',
    detail: 'Same CS-Index engine as articles — deconstructs what you wrote.',
  },
  {
    key: 'metadata',
    done: true,
    title: 'Filename and context',
    detail: 'Uses your description and attachment name (no binary yet).',
  },
  {
    key: 'pixels',
    done: false,
    title: 'Pixel forensics',
    detail: 'ELA, manipulation maps, generative traces — needs image bytes.',
  },
  {
    key: 'provenance',
    done: false,
    title: 'Provenance and sync',
    detail: 'Reverse search, original post, A/V drift — pipeline slot.',
  },
] as const;

export function MediaIntegrityPanel({ query }: { query: string }) {
  const filename = extractMediaFilename(query);
  const thinInput = looksLikeFilenameOnlyAudit(query);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-slate-950 shadow-lg shadow-violet-950/40"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-slate-950" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative grid gap-8 p-6 md:grid-cols-[1fr_minmax(0,340px)] md:items-start md:p-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300">
              <Clapperboard className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-violet-400/90">
                Media integrity layer
              </p>
              <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
                One engine — staged depth
              </h2>
            </div>
            <span className="ml-auto hidden rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-violet-200/80 sm:inline-flex">
              <Sparkles className="mr-1.5 inline h-3 w-3" />
              Beta pipeline
            </span>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
            Text you provide runs through the <span className="text-slate-200">same verification stack</span> as URLs
            and WhatsApp forwards. Visual forensics are a <span className="text-violet-300/90">second wave</span> that
            unlocks when we attach real pixels or waveform data to this report.
          </p>

          {filename ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 font-mono text-xs text-slate-300">
              <ScanLine className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="text-slate-500">Referenced file</span>
              <code className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] text-violet-200/90">{filename}</code>
            </div>
          ) : null}

          {thinInput ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <p className="text-sm font-medium text-amber-100/95">No image data reached the server</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-100/70">
                Only a filename (or very short note) was sent — the UI cannot render pixels yet, so the model
                correctly refuses to see the image. Add a detailed visual description (people, text in frame, logos,
                setting) on the home screen, or wire multimodal upload for a real media score.
              </p>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'mt-3 inline-flex border-amber-500/35 bg-amber-500/5 font-mono text-[10px] uppercase tracking-widest text-amber-100 hover:bg-amber-500/15',
                )}
              >
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back to intake
              </Link>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-sm">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Coverage map</p>
          <ul className="space-y-3">
            {PIPELINE.map((step, i) => (
              <li
                key={step.key}
                className={cn(
                  'flex gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                  step.done
                    ? 'border-emerald-500/20 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[10px]',
                    step.done
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                      : 'border-slate-700 bg-slate-900 text-slate-600',
                  )}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200">{step.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{step.detail}</p>
                </div>
                <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-wider text-slate-600 sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
