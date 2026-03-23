import Anthropic from "@anthropic-ai/sdk";
import { mockServers, mockAlerts, getMetrics } from "@/lib/mockData";

const SYSTEM_PROMPT = `당신은 게임 서버 SRE(Site Reliability Engineer) 전문가입니다.
운영자에게 서버 이상 징후의 원인과 조치 방법을 한국어로 간결하게 안내합니다.
반드시 아래 형식으로만 답변하세요:
## 현황 요약
## 원인 추정
## 권장 조치`;

function formatUptime(seconds: number): string {
  if (seconds === 0) return "다운 상태";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}일 ${hours}시간`;
  return `${hours}시간 ${Math.floor((seconds % 3600) / 60)}분`;
}

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { success: false, error: "API 키가 설정되지 않았습니다" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const server = mockServers.find((s) => s.id === id);

  if (!server) {
    return Response.json(
      { success: false, error: "서버를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  const recentMetrics = getMetrics(id, "1h").slice(-3);
  const avg = (key: keyof (typeof recentMetrics)[0]) => {
    const sum = recentMetrics.reduce((acc, m) => acc + (m[key] as number), 0);
    return recentMetrics.length > 0
      ? (sum / recentMetrics.length).toFixed(1)
      : "0";
  };

  const activeAlerts = mockAlerts.filter(
    (a) => a.serverId === id && a.status !== "resolved"
  );

  const statusLabel: Record<string, string> = {
    healthy: "정상",
    degraded: "저하",
    down: "다운",
  };

  const alertLines =
    activeAlerts.length > 0
      ? activeAlerts
          .map((a) => `  - [${a.severity}] ${a.title}: ${a.description}`)
          .join("\n")
      : "  없음";

  const userPrompt = `서버: ${server.name} (${server.region}, v${server.version})
상태: ${statusLabel[server.status]} / 업타임: ${formatUptime(server.uptimeSeconds)}

최근 지표 (최근 3개 포인트 평균):
- CPU: ${avg("cpuUsage")}% / 메모리: ${avg("memoryUsage")}% / RTT: ${avg("rttMs")}ms / 에러율: ${(parseFloat(avg("errorRate")) * 100).toFixed(1)}%
- 플레이어: ${server.playerCount}/${server.maxPlayers}

활성 알림 (${activeAlerts.length}개):
${alertLines}`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(enc.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return Response.json(
      { success: false, error: "분석 서비스에 일시적 오류가 발생했습니다" },
      { status: 502 }
    );
  }
}
