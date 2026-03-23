import { render, screen } from "@testing-library/react";
import { ServerStatusCard } from "@/components/dashboard/ServerStatusCard";

describe("ServerStatusCard", () => {
  it("status=total 일 때 label과 count를 렌더링한다", () => {
    render(<ServerStatusCard status="total" count={10} label="전체 서버" />);

    expect(screen.getByText("전체 서버")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("status=healthy 일 때 emerald 색상 클래스가 적용된다", () => {
    render(<ServerStatusCard status="healthy" count={5} label="정상" />);

    expect(screen.getByText("정상")).toBeInTheDocument();
    const countEl = screen.getByText("5");
    expect(countEl).toHaveClass("text-emerald-400");
  });

  it("status=degraded 일 때 label과 count를 렌더링한다", () => {
    render(<ServerStatusCard status="degraded" count={2} label="성능 저하" />);

    expect(screen.getByText("성능 저하")).toBeInTheDocument();
    const countEl = screen.getByText("2");
    expect(countEl).toHaveClass("text-yellow-400");
  });

  it("status=down 일 때 red 색상 클래스가 적용된다", () => {
    render(<ServerStatusCard status="down" count={1} label="다운" />);

    expect(screen.getByText("다운")).toBeInTheDocument();
    const countEl = screen.getByText("1");
    expect(countEl).toHaveClass("text-red-400");
  });

  it("count=0 이어도 정상 렌더링된다", () => {
    render(<ServerStatusCard status="healthy" count={0} label="정상 서버" />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
