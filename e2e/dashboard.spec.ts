import { test, expect } from "@playwright/test";

test.describe("대시보드", () => {
  test("루트 접속 시 /dashboard로 리다이렉트된다", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("서버 상태 카드 4개(전체/정상/저하/다운)가 표시된다", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: /대시보드|서버|ServerPulse/i }).first()
    ).toBeVisible({ timeout: 10000 });

    // 상태 카드 레이블 확인 (전체, 정상, 저하, 다운)
    await expect(page.getByText("전체 서버").first()).toBeVisible();
    await expect(page.getByText("정상").first()).toBeVisible();
    await expect(page.getByText("저하").first()).toBeVisible();
    await expect(page.getByText("다운").first()).toBeVisible();
  });

  test("서버 카드 클릭 시 서버 상세 페이지로 이동한다", async ({ page }) => {
    await page.goto("/dashboard");

    // 서버 카드가 로딩될 때까지 대기
    const serverCard = page.getByRole("button").first();
    await serverCard.waitFor({ timeout: 10000 });

    await serverCard.click();

    await expect(page).toHaveURL(/\/servers\/.+/);
  });
});
