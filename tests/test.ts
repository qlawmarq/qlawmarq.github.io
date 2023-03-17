import { expect, test } from "@playwright/test";

test("screenshot-home", async ({ page }) => {
  await page.goto("/");
  await delay(12000);
  await expect(page).toHaveScreenshot();
});

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
