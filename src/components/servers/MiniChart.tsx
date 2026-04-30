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

interface MiniChartProps {
  data: { time: string; value: number }[];
  color?: string;
  unit?: string;
  label: string;
}

interface TooltipPayloadItem {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  unit?: string;
}

function CustomTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface px-2.5 py-1.5 shadow-lg">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-fg-base">
        {typeof payload[0]?.value === "number"
          ? payload[0].value.toFixed(1)
          : "-"}
        {unit}
      </p>
    </div>
  );
}

export function MiniChart({
  data,
  color = "#6366f1",
  unit = "",
  label,
}: MiniChartProps) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-surface p-4">
      <p className="mb-3 text-xs font-medium text-fg-muted">{label}</p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart
          data={data}
          margin={{ top: 2, right: 4, bottom: 0, left: -20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
