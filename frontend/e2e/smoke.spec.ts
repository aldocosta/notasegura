import { test, expect } from "@playwright/test";

test("create and read note", async ({ page }) => {
  await page.goto("/");
  await page.fill("textarea", "hello e2e");
  await page.click("button:has-text('Criptografar e criar link')");
  await expect(page.locator("code")).toBeVisible();
  const link = await page.locator("code").textContent();
  expect(link).toBeTruthy();
  await page.goto(link!);
  await expect(page.locator("body")).toContainText("hello e2e");
});
