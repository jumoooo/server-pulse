import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServerList } from "@/components/servers/ServerList";
import { mockServer, mockDegradedServer } from "../fixtures";
import type { Server } from "@/types/server";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("ServerList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("서버 카드 목록을 렌더링한다", () => {
    render(<ServerList servers={[mockServer, mockDegradedServer]} />);

    expect(screen.getByText("Seoul Alpha")).toBeInTheDocument();
    expect(screen.getByText("Seoul Beta")).toBeInTheDocument();
  });

  it("각 서버의 상태 배지를 표시한다", () => {
    render(<ServerList servers={[mockServer, mockDegradedServer]} />);

    expect(screen.getByText("정상")).toBeInTheDocument();
    expect(screen.getByText("저하")).toBeInTheDocument();
  });

  it("서버 카드의 플레이어 수와 버전을 표시한다", () => {
    render(<ServerList servers={[mockServer]} />);

    expect(screen.getByText("1.20.4")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
  });

  it("서버 카드 클릭 시 해당 서버 상세 페이지로 이동한다", async () => {
    const user = userEvent.setup();
    render(<ServerList servers={[mockServer]} />);

    await user.click(screen.getByRole("button", { name: /Seoul Alpha/ }));

    expect(mockPush).toHaveBeenCalledWith("/servers/kr-1");
  });

  it("down 상태 서버의 배지를 표시한다", () => {
    const downServer: Server = {
      ...mockServer,
      id: "down-1",
      name: "Down Server",
      status: "down",
    };
    render(<ServerList servers={[downServer]} />);

    expect(screen.getByText("다운")).toBeInTheDocument();
  });

  it("빈 목록이면 서버 카드를 렌더링하지 않는다", () => {
    render(<ServerList servers={[]} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("region이 REGION_LABEL에 있는 경우 한국어 지역명을 표시한다", () => {
    render(<ServerList servers={[mockServer]} />);

    expect(screen.getByText("한국 (서울)")).toBeInTheDocument();
  });
});
