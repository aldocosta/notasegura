import { test, expect, type Page } from "@playwright/test";

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 375, height: 812 };
const NAV_LINKS: Array<[string, string]> = [
  ["Algoritmos", "/algoritmos"],
  ["Sobre", "/sobre"],
  ["Privacidade e Termos", "/privacidade"],
  ["Contato", "/contato"],
];

function mainNav(page: Page) {
  return page.locator('nav[aria-label="Principal"]');
}

function menuButton(page: Page) {
  return mainNav(page).getByRole("button", { name: "Menu", exact: true });
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("desktop shows the menu on every page", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  for (const path of ["/", "/privacidade", "/n/abc123", "/pagina-que-nao-existe"]) {
    await page.goto(path);
    for (const [name, href] of NAV_LINKS) {
      const link = mainNav(page).getByRole("link", { name, exact: true });
      await expect(link, `${path} ${name}`).toBeVisible();
      await expect(link, `${path} ${name}`).toHaveAttribute("href", href);
    }
    await expect(page.getByRole("button", { name: "Menu", exact: true }), path).not.toBeVisible();
  }
});

test("current page is marked", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(mainNav(page).getByRole("link", { name: "Privacidade e Termos", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("menu has no Como funciona link", async ({ page }) => {
  await page.goto("/");
  await expect(mainNav(page).getByRole("link", { name: "Como funciona" })).toHaveCount(0);
});

test("mobile menu opens, navigates, and closes", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  const sobre = mainNav(page).getByRole("link", { name: "Sobre", exact: true });
  await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  await expect(sobre).not.toBeVisible();
  await menuButton(page).click();
  await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
  await expect(sobre).toBeVisible();
  await sobre.click();
  await expect(page).toHaveURL(/\/sobre$/);
  await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
});

test("mobile menu closes on Escape", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await menuButton(page).click();
  await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton(page)).toBeFocused();
});

test("mobile has no horizontal scroll", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(await fits(), "menu closed").toBe(true);
  await menuButton(page).click();
  await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
  expect(await fits(), "menu open").toBe(true);
});
