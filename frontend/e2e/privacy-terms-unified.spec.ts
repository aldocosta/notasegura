import { test, expect, type Page } from "@playwright/test";

const DESKTOP = { width: 1280, height: 800 };
const TABLET = { width: 768, height: 1024 };
const SMALL_TABLET = { width: 640, height: 800 };
const MOBILE = { width: 375, height: 812 };
const TRUST_LINKS: Array<[string, string]> = [
  ["Sobre", "/sobre"],
  ["Privacidade e Termos", "/privacidade"],
  ["Contato", "/contato"],
];

function mainNav(page: Page) {
  return page.locator('nav[aria-label="Principal"]');
}

function fitsViewport(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}

function countTags(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, "g")) ?? []).length;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("terms URL redirects permanently", async ({ request }) => {
  const res = await request.get("/termos", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toMatch(/\/privacidade#termos$/);
});

test("old terms link lands on the terms part", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/termos");
  await expect(page).toHaveURL(/\/privacidade#termos$/);
  await expect(page.getByRole("heading", { level: 2, name: "Termos de Uso" })).toBeInViewport();
});

test("unified page serves both parts without JavaScript", async ({ request }) => {
  const res = await request.get("/privacidade");
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(countTags(html, "h1")).toBe(1);
  expect(html).toContain('id="privacidade"');
  expect(html).toContain('id="termos"');
  expect(html).toContain("Política de Privacidade e Termos de Uso");
  expect(html).not.toContain('href="/termos"');
});

test("anchor links jump to each part", async ({ page }) => {
  await page.goto("/privacidade");
  await page.locator('a[href="#termos"]').click();
  await expect(page).toHaveURL(/#termos$/);
  await expect(page.getByRole("heading", { level: 2, name: "Termos de Uso" })).toBeInViewport();
  await page.locator('a[href="#privacidade"]').click();
  await expect(page.getByRole("heading", { level: 2, name: "Política de Privacidade" })).toBeInViewport();
});

test("menu shows Algoritmos and the trust links; footer shows the trust links", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const expected: Array<[string, Array<[string, string]>]> = [
    ['nav[aria-label="Principal"]', [["Algoritmos", "/algoritmos"], ["Guias", "/guias"], ...TRUST_LINKS]],
    ['nav[aria-label="Rodapé"]', TRUST_LINKS],
  ];
  for (const [selector, navLinks] of expected) {
    const links = page.locator(selector).getByRole("link");
    await expect(links, selector).toHaveCount(navLinks.length);
    for (const [i, [name, href]] of navLinks.entries()) {
      const link = links.nth(i);
      await expect(link, `${selector} ${name}`).toHaveText(name);
      await expect(link, `${selector} ${name}`).toHaveAttribute("href", href);
      await expect(link, `${selector} ${name}`).toBeVisible();
    }
  }
});

test("header fits at 768px", async ({ page }) => {
  await page.setViewportSize(TABLET);
  await page.goto("/");
  const tops: number[] = [];
  for (const name of ["Algoritmos", "Guias", ...TRUST_LINKS.map(([label]) => label)]) {
    const link = mainNav(page).getByRole("link", { name, exact: true });
    await expect(link, name).toBeVisible();
    const box = await link.boundingBox();
    expect(box, name).not.toBeNull();
    tops.push(box!.y);
  }
  expect(new Set(tops).size, `link tops: ${tops.join(", ")}`).toBe(1);
  expect(await fitsViewport(page)).toBe(true);
});

test("header shows the Menu button at 640px", async ({ page }) => {
  await page.setViewportSize(SMALL_TABLET);
  await page.goto("/");
  const menuButton = mainNav(page).getByRole("button", { name: "Menu", exact: true });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  expect(await fitsViewport(page)).toBe(true);
});

test("unified page has no horizontal scroll on mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/privacidade");
  const menuButton = mainNav(page).getByRole("button", { name: "Menu", exact: true });
  expect(await fitsViewport(page), "menu closed").toBe(true);
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  expect(await fitsViewport(page), "menu open").toBe(true);
});
