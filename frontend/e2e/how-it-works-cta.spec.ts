import { test, expect } from "@playwright/test";

test('"Criar 1 Nota" scrolls back to the create note form', async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Como Funciona!" }).click();
  await expect(page.locator("#como-funciona")).toBeInViewport();
  await page.getByRole("link", { name: "Criar 1 Nota" }).click();
  await expect(page.locator("#criar-nota")).toBeInViewport();
  await expect(page.getByRole("textbox", { name: "Texto da nota" })).toBeFocused();
});

test('"Criar 1 Nota" is full width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const link = page.getByRole("link", { name: "Criar 1 Nota" });
  const box = await link.boundingBox();
  expect(box).not.toBeNull();
  const parentContentWidth = await link.evaluate((el) => {
    const parent = el.parentElement!;
    const style = getComputedStyle(parent);
    return parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  });
  expect(Math.abs(box!.width - parentContentWidth)).toBeLessThanOrEqual(2);
});

test('"Criar 1 Nota" is reachable by keyboard', async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Criar 1 Nota" });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("textbox", { name: "Texto da nota" })).toBeFocused();
});
