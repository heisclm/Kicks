"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function MonthlyTargetChart({ value, trend = 0 }: { value: number; trend?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const strokeWidth = 20;
  const radius = 80;
  const circumference = Math.PI * radius;
  // Start with empty arc for animation, then fill to value
  const strokeDashoffset = mounted
    ? circumference - (value / 100) * circumference
    : circumference;

  const isPositive = trend >= 0;

  return (
    <div className="relative w-full max-w-[280px] mx-auto mt-2 mb-4">
      <svg
        viewBox="0 0 200 115"
        className="w-full h-auto overflow-visible drop-shadow-sm"
      >
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label anchored inside the hollow arc */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-end">
        <div className="text-3xl font-bold tabular-nums text-foreground tracking-tight leading-none mb-1.5">
          {value.toFixed(2)}%
        </div>
        <div className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center tracking-wide",
          isPositive 
            ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" 
            : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
        )}>
          {isPositive ? (
            <ArrowUp size={12} className="mr-0.5" strokeWidth={2.5} />
          ) : (
            <ArrowDown size={12} className="mr-0.5" strokeWidth={2.5} />
          )}
          {Math.abs(trend).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
