import { expect, test } from "@playwright/test";

test("screenshot-home", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot({ fullPage: true });
});
