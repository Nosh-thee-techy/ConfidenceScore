import React from 'react';
import { Shield } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Shield className="w-12 h-12 text-emerald-500 animate-pulse" />
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
      </div>
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-500/50 animate-pulse">
        Decrypting Integrity...
      </div>
    </div>
  );
}
