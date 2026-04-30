import { prisma } from "@/lib/prisma";
import type { CreateServerInput, MetricPoint, Server, ServerDetail, UpdateServerInput } from "@/types/server";

type DbServer = {
  id: string;
  name: string;
  region: string;
  version: string;
  status: string;
  uptimeSeconds: number;
  lastHeartbeatAt: Date;
  playerCount: number;
  maxPlayers: number;
};

type DbMetricPoint = {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  rttMs: number;
  errorRate: number;
  playerCount: number;
};

export function mapDbServerToDto(server: DbServer): Server {
  return {
    id: server.id,
    name: server.name,
    region: server.region,
    version: server.version,
    status: server.status as Server["status"],
    uptimeSeconds: server.uptimeSeconds,
    lastHeartbeatAt: server.lastHeartbeatAt.toISOString(),
    playerCount: server.playerCount,
    maxPlayers: server.maxPlayers,
  };
}

export function mapDbMetricToDto(metric: DbMetricPoint): MetricPoint {
  return {
    timestamp: metric.timestamp.toISOString(),
    cpuUsage: metric.cpuUsage,
    memoryUsage: metric.memoryUsage,
    rttMs: metric.rttMs,
    errorRate: metric.errorRate,
    playerCount: metric.playerCount,
  };
}

export async function listServers(): Promise<Server[]> {
  const servers = await prisma.server.findMany({
    orderBy: { name: "asc" },
  });
  return servers.map(mapDbServerToDto);
}

export async function createServer(id: string, input: CreateServerInput): Promise<Server> {
  const created = await prisma.server.create({
    data: {
      id,
      name: input.name,
      region: input.region,
      version: input.version,
      status: input.status ?? "healthy",
      maxPlayers: input.maxPlayers ?? 100,
    },
  });
  return mapDbServerToDto(created);
}

export async function findServerDetailById(
  id: string,
  metricLimit = 24
): Promise<ServerDetail | null> {
  const server = await prisma.server.findUnique({
    where: { id },
    include: {
      metrics: {
        orderBy: { timestamp: "asc" },
        take: metricLimit,
      },
    },
  });

  if (!server) return null;

  return {
    ...mapDbServerToDto(server),
    metrics: server.metrics.map(mapDbMetricToDto),
  };
}

export async function findServerById(id: string): Promise<Server | null> {
  const server = await prisma.server.findUnique({ where: { id } });
  return server ? mapDbServerToDto(server) : null;
}

export async function updateServerById(
  id: string,
  input: UpdateServerInput
): Promise<Server | null> {
  const existing = await prisma.server.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return null;

  const updated = await prisma.server.update({
    where: { id },
    data: input,
  });
  return mapDbServerToDto(updated);
}

export async function deleteServerById(id: string): Promise<boolean> {
  const existing = await prisma.server.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return false;
  await prisma.server.delete({ where: { id } });
  return true;
}

export async function listServerMetricsByRange(
  serverId: string,
  range: "1h" | "6h" | "24h"
): Promise<MetricPoint[] | null> {
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { id: true },
  });
  if (!server) return null;

  const cutoffMs: Record<"1h" | "6h" | "24h", number> = {
    "1h": 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
  };
  const cutoff = new Date(Date.now() - cutoffMs[range]);

  const metrics = await prisma.metricPoint.findMany({
    where: {
      serverId,
      timestamp: { gte: cutoff },
    },
    orderBy: { timestamp: "asc" },
  });

  return metrics.map(mapDbMetricToDto);
}
