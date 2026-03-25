'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  /** Center number label under score (default: Confidence). */
  centerLabel?: string;
  /** Small line under centerLabel, e.g. narrative-only audit. */
  sublabel?: string;
}

export function ScoreRing({
  score,
  size = 200,
  strokeWidth = 15,
  centerLabel = 'Confidence',
  sublabel,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 40) return 'text-rose-500';
    if (s < 75) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getBgColor = (s: number) => {
    if (s < 40) return 'stroke-rose-500/20';
    if (s < 75) return 'stroke-amber-500/20';
    return 'stroke-emerald-500/20';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={getBgColor(score)}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={getColor(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-mono font-bold"
        >
          {score}
        </motion.span>
        <span className="font-mono text-xs uppercase tracking-widest text-slate-500">{centerLabel}</span>
        {sublabel ? (
          <span className="mt-1 max-w-[11rem] text-center font-mono text-[9px] uppercase leading-tight tracking-wider text-slate-600">
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
