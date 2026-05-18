"use client";

import { useEffect, useState } from "react";

interface ChartColors {
  grid: string;
  tick: string;
  line: string;
}

const FALLBACK_COLORS: ChartColors = {
  grid: "#1f2937",
  tick: "#d1d5db",
  line: "#6366f1",
};

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(FALLBACK_COLORS);

  useEffect(() => {
    // 차트 DOM 속성도 전역 시맨틱 토큰과 같은 색 체계를 읽도록 맞춰요.
    const documentStyle = getComputedStyle(document.documentElement);

    setColors({
      grid:
        documentStyle.getPropertyValue("--color-border-default").trim() ||
        FALLBACK_COLORS.grid,
      tick:
        documentStyle.getPropertyValue("--color-fg-muted").trim() ||
        FALLBACK_COLORS.tick,
      line:
        documentStyle.getPropertyValue("--color-interactive-accent").trim() ||
        FALLBACK_COLORS.line,
    });
  }, []);

  return colors;
}
