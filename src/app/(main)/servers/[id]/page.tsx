import { ServerDetailPage } from "@/features/servers/client";

interface ServerDetailPageRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ServerDetailPageRoute({
  params,
}: ServerDetailPageRouteProps) {
  const { id } = await params;
  const serverId = typeof id === "string" && id.trim().length > 0 ? id : null;

  return <ServerDetailPage serverId={serverId} />;
}
