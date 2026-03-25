'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Scale } from 'lucide-react';
import { PermanentSeal } from '@/components/PermanentSeal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Comparison() {
  const [urlA, setUrlA] = React.useState('');
  const [urlB, setUrlB] = React.useState('');
  const [isComparing, setIsComparing] = React.useState(false);

  const handleCompare = () => {
    if (!urlA || !urlB) return;
    setIsComparing(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Article A Source</label>
          <Input 
            placeholder="Enter first URL..." 
            className="bg-slate-900 border-slate-800 font-mono"
            value={urlA}
            onChange={(e) => setUrlA(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Article B Source</label>
          <Input 
            placeholder="Enter second URL..." 
            className="bg-slate-900 border-slate-800 font-mono"
            value={urlB}
            onChange={(e) => setUrlB(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleCompare}
          disabled={!urlA || !urlB || isComparing}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold uppercase tracking-widest px-12"
        >
          {isComparing ? "Analyzing Asymmetry..." : "Compare Sources"}
        </Button>
      </div>

      {isComparing ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Scale of Truth */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500">Scale of Truth</div>
            <div className="relative w-full max-w-2xl h-4 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
              <motion.div 
                initial={{ left: '50%' }}
                animate={{ left: '65%' }}
                className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
              />
              <div className="absolute inset-0 flex justify-between px-4 items-center pointer-events-none">
                <span className="text-[8px] font-mono text-slate-600 uppercase">Source A</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase">Source B</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Source B shows +15% higher confidence</div>
            <PermanentSeal />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Vertical Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-900 -translate-x-1/2" />

            {/* Article A Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-slate-800 text-slate-500 font-mono">Source A</Badge>
                <div className="text-2xl font-mono font-bold">74</div>
              </div>
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-slate-500">Unique Claims</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                    <p className="text-sm text-rose-200 font-medium">Claim: "Government funding was cut by 40% in Q1"</p>
                    <p className="text-[10px] font-mono text-rose-500 uppercase mt-1">Asymmetry Detected: Missing in Source B</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Article B Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-slate-800 text-emerald-500 font-mono">Source B</Badge>
                <div className="text-2xl font-mono font-bold text-emerald-500">89</div>
              </div>
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-slate-500">Unique Claims</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <p className="text-sm text-emerald-200 font-medium">Claim: "New private investment offset 80% of budget gaps"</p>
                    <p className="text-[10px] font-mono text-emerald-500 uppercase mt-1">Asymmetry Detected: Missing in Source A</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-900 rounded-2xl">
          <Scale className="w-12 h-12 text-slate-800 mb-4" />
          <p className="text-slate-600 font-mono uppercase tracking-widest text-sm">Waiting for dual-source input...</p>
        </div>
      )}
    </div>
  );
}
