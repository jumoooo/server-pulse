"use client";

import { useParams } from "next/navigation";
import { useServerDetail } from "@/hooks/useServerDetail";
import { ServerDetail } from "@/components/servers/ServerDetail";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

export default function ServerDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;

  const { data: server, isLoading, error, refetch } = useServerDetail(id);

  if (isLoading) return <LoadingState message="서버 정보를 불러오는 중..." />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!server) return <ErrorState message="서버를 찾을 수 없습니다." />;

  return <ServerDetail server={server} />;
}
