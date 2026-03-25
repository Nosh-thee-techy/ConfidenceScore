'use client';

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Comparison } from '@/components/Comparison';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="p-6 border-b border-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-500" />
            <span className="text-xl font-mono font-bold tracking-tighter uppercase">Comparison Engine</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1 mb-8">
            <h1 className="text-3xl font-bold tracking-tight uppercase">Asymmetry Analysis</h1>
            <p className="text-slate-500 font-mono text-sm">Compare two sources side-by-side to detect narrative gaps.</p>
          </div>
          
          <Comparison />
        </motion.div>
      </main>
    </div>
  );
}
