"use client";

import { cn } from "@/lib/utils";

interface HalftonePatternProps {
  variant?: "corner" | "full" | "strip" | "diagonal";
  color?: string;
  opacity?: number;
  className?: string;
}

export function HalftonePattern({
  variant = "corner",
  color = "#FF5A1F",
  opacity = 0.15,
  className,
}: HalftonePatternProps) {
  const dotRadius = variant === "strip" ? 1.2 : 1.5;
  const spacing = variant === "strip" ? 10 : 12;

  if (variant === "corner") {
    return (
      <svg
        className={cn("absolute pointer-events-none", className)}
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="halftone-fade-corner" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({ length: Math.ceil(320 / spacing) }).map((_, row) =>
          Array.from({ length: Math.ceil(320 / spacing) }).map((_, col) => {
            const x = col * spacing + spacing / 2;
            const y = row * spacing + spacing / 2;
            const dist = Math.sqrt(x * x + y * y);
            const maxDist = Math.sqrt(320 * 320 + 320 * 320);
            const dotOpacity = Math.max(0, opacity * (1 - dist / maxDist));
            const r = dotRadius * (1 - dist / maxDist * 0.5);
            if (dotOpacity < 0.01 || r < 0.2) return null;
            return (
              <circle
                key={`${row}-${col}`}
                cx={x}
                cy={y}
                r={r}
                fill={color}
                fillOpacity={dotOpacity}
              />
            );
          })
        )}
      </svg>
    );
  }

  if (variant === "strip") {
    return (
      <svg
        className={cn("absolute pointer-events-none", className)}
        width="100%"
        height="100"
        preserveAspectRatio="none"
        viewBox="0 0 1200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {Array.from({ length: 10 }).map((_, row) =>
          Array.from({ length: 120 }).map((_, col) => {
            const x = col * spacing + spacing / 2;
            const y = row * spacing + spacing / 2;
            const fadeY = 1 - Math.abs(y - 50) / 50;
            const dotOpacity = opacity * fadeY;
            if (dotOpacity < 0.01) return null;
            return (
              <circle
                key={`s-${row}-${col}`}
                cx={x}
                cy={y}
                r={dotRadius * fadeY}
                fill={color}
                fillOpacity={dotOpacity}
              />
            );
          })
        )}
      </svg>
    );
  }

  if (variant === "diagonal") {
    return (
      <svg
        className={cn("absolute pointer-events-none", className)}
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {Array.from({ length: Math.ceil(400 / spacing) }).map((_, row) =>
          Array.from({ length: Math.ceil(400 / spacing) }).map((_, col) => {
            const x = col * spacing + spacing / 2;
            const y = row * spacing + spacing / 2;
            const diagDist = Math.abs(x + y - 400) / 400;
            const dotOpacity = Math.max(0, opacity * (1 - diagDist * 2));
            if (dotOpacity < 0.01) return null;
            return (
              <circle
                key={`d-${row}-${col}`}
                cx={x}
                cy={y}
                r={dotRadius * (1 - diagDist)}
                fill={color}
                fillOpacity={dotOpacity}
              />
            );
          })
        )}
      </svg>
    );
  }

  // variant === "full"
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
      />
    </div>
  );
}
