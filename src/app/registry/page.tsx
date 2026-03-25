'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Search, TrendingUp, TrendingDown, CheckCircle2, Globe, ArrowLeft, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { PermanentSeal } from '@/components/PermanentSeal';
import { MOCK_REGISTRY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function RegistryPage() {
  const [search, setSearch] = React.useState('');
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [trendFilter, setTrendFilter] = React.useState<'all' | 'up' | 'down'>('all');

  const filtered = MOCK_REGISTRY.filter(item => {
    const matchesSearch = item.domain.toLowerCase().includes(search.toLowerCase());
    const matchesVerified = !verifiedOnly || item.verified;
    const matchesTrend = trendFilter === 'all' || item.trend === trendFilter;
    return matchesSearch && matchesVerified && matchesTrend;
  });

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
            <span className="text-xl font-mono font-bold tracking-tighter uppercase">Global Trust Registry</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight uppercase">Publisher Index</h1>
            <p className="text-slate-500 font-mono text-sm">Historical integrity data for global news domains.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search domains..." 
                className="pl-10 bg-slate-900 border-slate-800 font-mono"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-900/50 border border-slate-900 rounded-xl">
          <div className="flex items-center gap-2 text-slate-500 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-mono">Filters</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={cn(
                "h-8 text-[10px] font-mono uppercase tracking-widest border-slate-800",
                verifiedOnly ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50" : "text-slate-400"
              )}
            >
              <CheckCircle2 className="w-3 h-3 mr-2" />
              Verified Only
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-2 hidden sm:block" />

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTrendFilter('all')}
              className={cn(
                "h-8 text-[10px] font-mono uppercase tracking-widest border-slate-800",
                trendFilter === 'all' ? "bg-slate-800 text-white" : "text-slate-400"
              )}
            >
              All Trends
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTrendFilter('up')}
              className={cn(
                "h-8 text-[10px] font-mono uppercase tracking-widest border-slate-800",
                trendFilter === 'up' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50" : "text-slate-400"
              )}
            >
              <TrendingUp className="w-3 h-3 mr-2" />
              Trending Up
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTrendFilter('down')}
              className={cn(
                "h-8 text-[10px] font-mono uppercase tracking-widest border-slate-800",
                trendFilter === 'down' ? "bg-rose-500/10 text-rose-500 border-rose-500/50" : "text-slate-400"
              )}
            >
              <TrendingDown className="w-3 h-3 mr-2" />
              Trending Down
            </Button>
          </div>

          <div className="ml-auto text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Showing {filtered.length} of {MOCK_REGISTRY.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.domain}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all group">
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <CardTitle className="text-sm font-mono truncate max-w-[120px]">{item.domain}</CardTitle>
                  </div>
                  {item.verified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-mono font-bold">{item.score}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Avg Score</div>
                    </div>
                    <div className="flex flex-col items-end">
                      {item.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-rose-500" />
                      )}
                      <span className="text-[10px] font-mono uppercase text-slate-500">30D Trend</span>
                    </div>
                  </div>
                  
                  <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.history.map((v, i) => ({ v, i }))}>
                        <Line 
                          type="monotone" 
                          dataKey="v" 
                          stroke={item.trend === 'up' ? '#10b981' : '#f43f5e'} 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="pt-2 border-t border-slate-800/50 flex justify-center">
                    <PermanentSeal />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
