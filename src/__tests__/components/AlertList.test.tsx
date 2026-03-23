import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertList } from "@/components/alerts/AlertList";
import type { Alert } from "@/types/server";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const baseAlert: Alert = {
  id: "alert-1",
  serverId: "us-2",
  serverName: "US East Secondary",
  severity: "critical",
  status: "open",
  title: "서버 응답 없음",
  description: "5분 이상 heartbeat가 수신되지 않습니다.",
  ruleId: "rule-heartbeat",
  createdAt: new Date(Date.now() - 310000).toISOString(),
};

describe("AlertList", () => {
  it("알림 목록을 렌더링한다", () => {
    const alerts: Alert[] = [
      baseAlert,
      { ...baseAlert, id: "alert-2", title: "CPU 과부하" },
    ];
    render(<AlertList alerts={alerts} onStatusChange={vi.fn()} />);

    expect(screen.getByText("서버 응답 없음")).toBeInTheDocument();
    expect(screen.getByText("CPU 과부하")).toBeInTheDocument();
  });

  it("status=open 알림에 '확인' 버튼이 표시된다", () => {
    render(
      <AlertList
        alerts={[{ ...baseAlert, status: "open" }]}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("status=acknowledged 알림에 '해결' 버튼이 표시된다", () => {
    render(
      <AlertList
        alerts={[{ ...baseAlert, status: "acknowledged" }]}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "해결" })).toBeInTheDocument();
  });

  it("status=resolved 알림에 버튼이 없다", () => {
    render(
      <AlertList
        alerts={[{ ...baseAlert, status: "resolved" }]}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("'확인' 버튼 클릭 시 onStatusChange가 acknowledged 상태로 호출된다", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    render(
      <AlertList
        alerts={[{ ...baseAlert, status: "open" }]}
        onStatusChange={onStatusChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onStatusChange).toHaveBeenCalledWith("alert-1", "acknowledged");
  });

  it("'해결' 버튼 클릭 시 onStatusChange가 resolved 상태로 호출된다", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    render(
      <AlertList
        alerts={[{ ...baseAlert, status: "acknowledged" }]}
        onStatusChange={onStatusChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "해결" }));

    expect(onStatusChange).toHaveBeenCalledWith("alert-1", "resolved");
  });

  it("isPending=true 일 때 버튼이 disabled 상태가 된다", () => {
    render(
      <AlertList
        alerts={[{ ...baseAlert, status: "open" }]}
        onStatusChange={vi.fn()}
        isPending
      />
    );

    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  it("빈 목록이면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(
      <AlertList alerts={[]} onStatusChange={vi.fn()} />
    );

    expect(container.querySelector("li")).not.toBeInTheDocument();
  });
});
