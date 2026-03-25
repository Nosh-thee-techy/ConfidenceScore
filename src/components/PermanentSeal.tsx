'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, FileCheck, History, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PermanentSeal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer outline-none"
          />
        }
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center gap-2 bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-full shadow-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">Forensic Seal</span>
        </div>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-950 border-slate-800 max-w-lg overflow-hidden p-0">
        <div className="relative p-8 space-y-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />
          
          <DialogHeader className="relative z-10 text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <Award className="w-10 h-10 text-emerald-500" />
            </div>
            <DialogTitle className="text-2xl font-mono font-bold uppercase tracking-tighter">Certificate of Audit</DialogTitle>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Permanent Verification Protocol v2.4</p>
          </DialogHeader>

          <div className="relative z-10 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">Summary of Permanent Verification</h3>
              
              <div className="grid gap-4">
                <div className="flex gap-4 items-start group">
                  <div className="mt-1 w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200">Verification</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">The badge shows the article matches the primary source. Cross-referenced against original wire feeds and official statements.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group">
                  <div className="mt-1 w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200">Validation</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">The badge shows no &quot;Lies of Omission&quot; were found. Our forensic engine confirms all critical context has been preserved.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group">
                  <div className="mt-1 w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                    <History className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200">Permanence</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">The audit is saved in the Global Trust Registry forever. Even if the news site deletes the article, your registry keeps the record of the audit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/70">Registry Status</div>
                <div className="text-xs font-mono font-bold text-emerald-500 uppercase">Immutable Record Active</div>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-mono text-[10px]">VERIFIED</Badge>
            </div>
          </div>

          <div className="relative z-10 flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 border-slate-800 hover:bg-slate-900 font-mono text-xs uppercase tracking-widest h-10">
              <ExternalLink className="w-3 h-3 mr-2" /> View in Registry
            </Button>
            <DialogClose render={<Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-mono text-xs uppercase tracking-widest h-10" />}>
              Close Certificate
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
