'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { IntakeHub } from '@/components/IntakeHub';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-900 p-6">
        <div
          className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
          onClick={() => window.location.reload()}
        >
          <Shield className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-mono font-bold uppercase tracking-tighter">
            Confidence Score
          </span>
        </div>
        <nav className="hidden gap-8 font-mono text-sm uppercase tracking-widest text-slate-400 md:flex">
          <Link href="/registry" className="transition-colors hover:text-emerald-500">
            Registry
          </Link>
          <Link href="/compare" className="transition-colors hover:text-emerald-500">
            Compare
          </Link>
          <span className="cursor-not-allowed text-slate-600" title="Coming soon">
            API
          </span>
        </nav>
      </header>

      <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="relative z-10 flex w-full flex-col items-center">
          <IntakeHub />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-2"
          >
            {['Fact check', 'Completeness', 'Source quality', 'Kenya context', 'Gap analysis'].map(
              (layer) => (
                <span
                  key={layer}
                  className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-500"
                >
                  {layer}
                </span>
              ),
            )}
            <span className="rounded-full border border-dashed border-slate-700 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Media forensics (pipeline)
            </span>
          </motion.div>

          <div className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-8">
            {[
              { label: 'Audits Today', value: '12,402', icon: BarChart3 },
              { label: 'Verified Outlets', value: '842', icon: Shield },
              { label: 'Accuracy Rate', value: '99.8%', icon: CheckCircle2 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="space-y-1 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <stat.icon className="h-4 w-4" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <div className="font-mono text-2xl font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-600">
          © 2026 Confidence Score · Africa&apos;s trust infrastructure — one engine, one standard
        </p>
      </footer>
    </div>
  );
}
