/**
 * 게임 서버 실시간 모니터링 타입 (백엔드 계약 미러)
 * 백엔드에서 import하지 않고 로컬에서 타입을 정의
 */

export type LatencyCategory = "GOOD" | "NORMAL" | "HIGH" | "CRITICAL";
export type HealthStatus = "GOOD" | "WARNING" | "HIGH_LOAD" | "CRITICAL";

export interface GameServerState {
  id: string;
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  ping: number;
  game: string;
  latencyCategory: LatencyCategory;
  playerList?: Array<{ name: string; score?: number; time?: number }>;
  rules?: Record<string, string>;
  queriedAt: string;
}

export interface GameServerHealthResponse extends GameServerState {
  health: HealthStatus;
  reason?: string;
}

export interface GameServerTrendEntry {
  timestamp: string;
  players: number;
  ping: number;
}

export interface GameServerTrendResponse {
  serverId: string;
  history: GameServerTrendEntry[];
}

export interface GameServerOverviewResponse {
  servers: GameServerState[];
  errors?: string[];
}

export type DiagnoseStatus = "GOOD" | "WARNING" | "HIGH_LOAD" | "CRITICAL";

export interface GameServerDiagnoseResponse extends GameServerState {
  status: DiagnoseStatus;
  reason?: string;
  analysis: string[];
}

export interface PlayerInfo {
  name: string;
  score?: number;
  time?: number;
}

export interface GameServerPlayersResponse {
  playerList: PlayerInfo[];
}
