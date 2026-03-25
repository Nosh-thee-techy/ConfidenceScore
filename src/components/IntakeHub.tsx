'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Link2, Clapperboard, ArrowDown, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  type IntakeChannel,
  CHANNEL_LABELS,
} from '@/lib/intake-channels';

const channelOrder: IntakeChannel[] = ['angaza', 'article', 'media'];

const channelIcons = {
  angaza: MessageCircle,
  article: Link2,
  media: Clapperboard,
} as const;

export function IntakeHub() {
  const router = useRouter();
  const [channel, setChannel] = React.useState<IntakeChannel>('article');
  const [text, setText] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const buildQuery = (): string | null => {
    if (channel === 'media') {
      const ctx = text.trim();
      if (!ctx && !file) return null;
      const name = file ? file.name : 'attached media';
      if (!ctx) return null;
      return `[Media context: ${name}]\n${ctx}`;
    }
    const q = text.trim();
    return q || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = buildQuery();
    if (!query) return;
    setIsScanning(true);
    const id = Math.random().toString(36).substring(7).toUpperCase();
    setTimeout(() => {
      router.push(`/report/${id}?query=${encodeURIComponent(query)}&channel=${channel}`);
    }, 400);
  };

  const placeholders: Record<IntakeChannel, string> = {
    angaza: 'Paste a forwarded message, rumour, or claim…',
    article: 'Paste a news article URL or headline to audit…',
    media: 'Describe the clip, caption, or what looks suspicious (required for now)…',
  };

  return (
    <div className="w-full max-w-4xl space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center space-y-4"
      >
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-500/90">
          One question · three doors in
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 md:text-6xl md:leading-[1.05]">
          Can I trust <span className="text-emerald-500">this?</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
          WhatsApp forward, article link, or suspicious media — same{' '}
          <span className="text-slate-300">Confidence Score</span> engine underneath. Only the
          entry shape and how we present the result changes.
        </p>
      </motion.div>

      {/* Three entry points */}
      <div className="grid gap-4 md:grid-cols-3">
        {channelOrder.map((key, i) => {
          const meta = CHANNEL_LABELS[key];
          const Icon = channelIcons[key];
          const active = channel === key;
          return (
            <motion.button
              key={key}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              onClick={() => setChannel(key)}
              className={cn(
                'group relative flex flex-col rounded-2xl border p-5 text-left transition-all',
                active
                  ? 'border-emerald-500/60 bg-emerald-500/5 shadow-[0_0_40px_-12px_rgba(16,185,129,0.35)]'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700',
              )}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border',
                    active
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                      : 'border-slate-800 bg-slate-950 text-slate-500',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-sm font-bold uppercase tracking-wide text-slate-200">
                    {meta.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{meta.subtitle}</p>
                </div>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-slate-600">
                e.g. {meta.example}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Converge visual */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex w-full max-w-md items-center justify-center gap-2 text-slate-600">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
          <ArrowDown className="h-4 w-4 shrink-0 text-emerald-500/70" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700" />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <Cpu className="h-3.5 w-3.5 text-emerald-500" />
          Confidence Score engine
        </div>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="relative group"
      >
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 opacity-40 blur transition duration-500 group-focus-within:opacity-70" />
        <div className="relative space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 md:p-5">
          {channel === 'media' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f && (f.type.startsWith('image/') || f.type.startsWith('video/'))) setFile(f);
                }}
                className={cn(
                  'flex w-full flex-col items-center justify-center rounded-xl border border-dashed bg-slate-950/50 px-4 py-8 text-center transition hover:border-emerald-500/40 hover:bg-slate-950',
                  dragOver ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700',
                )}
              >
                <Clapperboard className="mb-2 h-8 w-8 text-slate-600" />
                <span className="font-mono text-sm text-slate-400">
                  {file ? file.name : 'Drop or tap to attach image / video (optional)'}
                </span>
                <span className="mt-1 text-[11px] text-slate-600">
                  Frame-level forensics ship on the media pipeline — today we still audit the story you describe.
                </span>
              </button>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {channel === 'angaza' && 'Forwarded content'}
                {channel === 'article' && 'URL or claim'}
                {channel === 'media' && 'What should we check?'}
              </label>
              <Input
                type="text"
                placeholder={placeholders[channel]}
                className="h-12 border-slate-800 bg-slate-950/80 font-mono text-base placeholder:text-slate-600"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isScanning}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 shrink-0 bg-emerald-500 px-8 font-bold uppercase tracking-widest text-slate-950 hover:bg-emerald-400"
              disabled={isScanning || !buildQuery()}
            >
              {isScanning ? 'Running…' : channel === 'article' ? 'Full audit' : 'Run check'}
            </Button>
          </div>
        </div>
      </motion.form>

      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
        Angaza is the WhatsApp face · this site is the research desk · API & extension share the same standard
      </p>
    </div>
  );
}
