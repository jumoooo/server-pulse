"use client";

import { useState, useCallback } from "react";

type State = "idle" | "loading" | "streaming" | "done" | "error";

interface AnalysisPanelProps {
  serverId: string;
  onClose: () => void;
}

function renderLine(line: string, index: number) {
  if (line.startsWith("## ")) {
    return (
      <p key={index} className="mt-4 first:mt-0 text-sm font-semibold text-indigo-400">
        {line.slice(3)}
      </p>
    );
  }
  if (line === "") return <div key={index} className="h-1" />;
  return (
    <p key={index} className="text-sm text-gray-300 leading-relaxed">
      {line}
    </p>
  );
}

export function AnalysisPanel({ serverId, onClose }: AnalysisPanelProps) {
  const [state, setState] = useState<State>("idle");
  const [text, setText] = useState("");

  const analyze = useCallback(async () => {
    setState("loading");
    setText("");

    try {
      const res = await fetch(`/api/analyze/${serverId}`, { method: "POST" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "분석 요청에 실패했습니다");
      }

      if (!res.body) throw new Error("응답 스트림이 없습니다");

      setState("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setState("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setText(message);
      setState("error");
    }
  }, [serverId]);

  const isRunning = state === "loading" || state === "streaming";

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gray-900 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm font-semibold text-white">AI 서버 분석</span>
        </div>
        <div className="flex items-center gap-2">
          {state === "idle" || state === "done" || state === "error" ? (
            <button
              type="button"
              onClick={analyze}
              disabled={isRunning}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === "done" || state === "error" ? "재분석" : "분석 시작"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            닫기
          </button>
        </div>
      </div>

      {state === "idle" && (
        <p className="mt-4 text-sm text-gray-500">
          현재 서버 지표와 활성 알림을 바탕으로 AI가 원인을 분석하고 권장 조치를 제안합니다.
        </p>
      )}

      {state === "loading" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          분석 중...
        </div>
      )}

      {(state === "streaming" || state === "done") && (
        <div className="mt-4 space-y-0.5">
          {text.split("\n").map((line, i) => renderLine(line, i))}
          {state === "streaming" && (
            <span className="inline-block h-4 w-0.5 animate-pulse bg-indigo-400" />
          )}
        </div>
      )}

      {state === "error" && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-sm text-red-400">{text}</p>
        </div>
      )}
    </div>
  );
}
