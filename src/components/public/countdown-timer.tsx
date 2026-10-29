"use client";

import * as React from "react";
import { getTimeRemaining } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string | Date;
  onExpire?: () => void;
  compact?: boolean;
}

export function CountdownTimer({ endDate, onExpire, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  React.useEffect(() => {
    // Initial calculation
    const initial = getTimeRemaining(endDate);
    setTimeLeft(initial);
    if (initial.expired && onExpire) onExpire();

    const interval = setInterval(() => {
      const current = getTimeRemaining(endDate);
      setTimeLeft(current);
      if (current.expired) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, onExpire]);

  if (timeLeft.expired) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span>Event Closed</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-1 font-mono font-bold text-xs text-[#111111] bg-[#F5F5F3] px-2.5 py-1 border border-[#E5E5E5]">
        <Clock className="h-3 w-3 text-[#FF5A1F]" />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-[#111111] text-white px-2.5 py-1 border-b-2 border-[#FF5A1F] min-w-[42px]">
          <span className="font-mono text-base font-black leading-tight">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">Days</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-[#111111] text-white px-2.5 py-1 border-b-2 border-[#FF5A1F] min-w-[42px]">
        <span className="font-mono text-base font-black leading-tight">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">Hrs</span>
      </div>
      <div className="flex flex-col items-center bg-[#111111] text-white px-2.5 py-1 border-b-2 border-[#FF5A1F] min-w-[42px]">
        <span className="font-mono text-base font-black leading-tight">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">Min</span>
      </div>
      <div className="flex flex-col items-center bg-[#FF5A1F] text-white px-2.5 py-1 min-w-[42px]">
        <span className="font-mono text-base font-black leading-tight">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-white/90">Sec</span>
      </div>
    </div>
  );
}
