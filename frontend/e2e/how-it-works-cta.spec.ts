import { test, expect } from "@playwright/test";

test('"Criar a primeira nota" scrolls to the create note form', async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Como Funciona!" }).click();
  await expect(page.locator("#como-funciona")).toBeInViewport();
  await page.getByRole("link", { name: "Criar a primeira nota" }).click();
  await expect(page.locator("#criar-nota")).toBeInViewport();
  await expect(page.getByRole("textbox", { name: "Texto da nota" })).toBeFocused();
});

test('"Criar a primeira nota" is full width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const link = page.getByRole("link", { name: "Criar a primeira nota" });
  const box = await link.boundingBox();
  expect(box).not.toBeNull();
  const parentContentWidth = await link.evaluate((el) => {
    const parent = el.parentElement!;
    const style = getComputedStyle(parent);
    return parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  });
  expect(Math.abs(box!.width - parentContentWidth)).toBeLessThanOrEqual(2);
});

test('"Criar a primeira nota" is reachable by keyboard', async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Criar a primeira nota" });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("textbox", { name: "Texto da nota" })).toBeFocused();
});

test("Como funciona is above the form", async ({ page }) => {
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const howItWorks = await page.locator("#como-funciona").boundingBox();
    const form = await page.locator("#criar-nota").boundingBox();
    expect(howItWorks, `${viewport.width}px`).not.toBeNull();
    expect(form, `${viewport.width}px`).not.toBeNull();
    expect(howItWorks!.y, `${viewport.width}px`).toBeLessThan(form!.y);
  }
});
