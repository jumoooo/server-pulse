"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MetricPoint } from "@/types/server";
import { EmptyState } from "@/components/common/EmptyState";
import { useChartColors } from "@/hooks/useChartColors";

interface PlayerChartProps {
  data: MetricPoint[];
}

interface TooltipPayloadItem {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-indigo-400">
        {payload[0]?.value ?? 0}명
      </p>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function PlayerChart({ data }: PlayerChartProps) {
  const chartColors = useChartColors();

  if (!data.length) {
    return <EmptyState message="플레이어 데이터가 없습니다." />;
  }

  const chartData = data.map((p) => ({
    time: formatTime(p.timestamp),
    players: p.playerCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={chartData}
        margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis
          dataKey="time"
          tick={{ fill: chartColors.tick, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: chartColors.tick, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="players"
          stroke={chartColors.line}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: chartColors.line, stroke: chartColors.grid }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
