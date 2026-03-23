interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "표시할 항목이 없습니다." }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <p className="text-sm">{message}</p>
    </div>
  );
}
