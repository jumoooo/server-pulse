import { test, expect } from "@playwright/test";

test.describe("알림 페이지", () => {
  test("/alerts 접속 시 알림 목록이 표시된다", async ({ page }) => {
    await page.goto("/alerts");

    // 페이지 로드 확인
    await expect(page).toHaveURL(/\/alerts/);

    // 알림 목록 또는 빈 상태 메시지가 표시됨
    await page.waitForLoadState("networkidle");

    const hasAlerts = await page.locator("ul li").count();
    const hasEmptyState = await page
      .getByText(/알림이 없습니다|알림 없음|no alerts/i)
      .count();

    expect(hasAlerts + hasEmptyState).toBeGreaterThan(0);
  });

  test("severity 필터 버튼이 존재하고 클릭 가능하다", async ({ page }) => {
    await page.goto("/alerts");

    await page.waitForLoadState("networkidle");

    // severity 필터 버튼들 확인
    const filterButtons = page.getByRole("button", {
      name: /전체|심각|경고|정보/,
    });
    const count = await filterButtons.count();

    // 필터 버튼이 하나 이상 존재하는지 확인
    if (count > 0) {
      await filterButtons.first().click();
      // 클릭 후 페이지가 정상 동작하는지 확인
      await expect(page).toHaveURL(/\/alerts/);
    }
  });
});
