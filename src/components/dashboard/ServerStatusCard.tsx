import type { ServerStatus } from "@/types/server";

interface ServerStatusCardProps {
  status: ServerStatus | "total";
  count: number;
  label: string;
}

const statusConfig = {
  total: {
    border: "border-gray-700",
    text: "text-gray-300",
    bg: "bg-gray-700/30",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
  healthy: {
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  degraded: {
    border: "border-yellow-500/40",
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5C2.57 18.333 3.532 20 5.072 20z"
        />
      </svg>
    ),
  },
  down: {
    border: "border-red-500/40",
    text: "text-red-400",
    bg: "bg-red-400/10",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export function ServerStatusCard({
  status,
  count,
  label,
}: ServerStatusCardProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`bg-gray-900 border ${config.border} rounded-xl p-5 flex items-center gap-4`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg ${config.bg} ${config.text} shrink-0`}
      >
        {config.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`mt-0.5 text-3xl font-bold ${config.text}`}>{count}</p>
      </div>
    </div>
  );
}
