import { test, expect, type Page } from "@playwright/test";

const TRUST_PAGES = ["/sobre", "/privacidade", "/contato"];
const MOBILE = { width: 375, height: 812 };
const DESKTOP = { width: 1280, height: 800 };

function highlightTiles(page: Page) {
  return page.locator('ul[aria-label="Destaques"] > li');
}

async function tileBoxes(page: Page, count: number) {
  const tiles = highlightTiles(page);
  await expect(tiles.first()).toBeVisible();
  const boxes = [];
  for (let i = 0; i < count; i++) {
    const box = await tiles.nth(i).boundingBox();
    expect(box, `tile ${i}`).not.toBeNull();
    boxes.push(box!);
  }
  return boxes;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("header logo on every page", async ({ page }) => {
  for (const path of ["/", "/sobre", "/n/abc123", "/pagina-que-nao-existe"]) {
    await page.goto(path);
    const brand = page.getByRole("link", { name: "Nota Segura - BR", exact: true });
    await expect(brand, path).toHaveAttribute("href", "/");
    await expect(brand.locator("svg"), path).toBeVisible();
  }
});

test("404 shows the logo in content and footer", async ({ page }) => {
  await page.goto("/pagina-que-nao-existe");
  await expect(page.locator("main svg")).toBeVisible();
  await expect(page.locator("footer svg")).toBeVisible();
});

test("site icon is the logo", async ({ request }) => {
  const icon = await request.get("/icon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toMatch(/^image\/svg\+xml/);

  const html = await (await request.get("/")).text();
  expect(html).toContain('rel="icon"');
  expect(html).toContain('href="/icon.svg');

  const favicon = await request.get("/favicon.ico");
  expect(favicon.status()).toBe(404);
});

test("trust pages show hero and highlights", async ({ page }) => {
  for (const path of TRUST_PAGES) {
    await page.goto(path);
    await expect(page.locator("[data-hero] h1"), path).toBeVisible();
    const tiles = highlightTiles(page);
    expect(await tiles.count(), path).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < 3; i++) {
      await expect(tiles.nth(i), `${path} tile ${i}`).toBeVisible();
    }
  }
});

test("highlights stack on mobile and align on desktop", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/privacidade");
  const [first, second] = await tileBoxes(page, 2);
  expect(second.y).not.toBe(first.y);
  expect(Math.abs(second.x - first.x)).toBeLessThanOrEqual(2);

  await page.setViewportSize(DESKTOP);
  await page.goto("/privacidade");
  const boxes = await tileBoxes(page, 3);
  for (const box of boxes.slice(1)) {
    expect(Math.abs(box.y - boxes[0].y)).toBeLessThanOrEqual(2);
  }
});

test("trust pages fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  for (const path of TRUST_PAGES) {
    await page.goto(path);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits, path).toBe(true);
  }
});

test("contact button opens mail", async ({ page }) => {
  await page.goto("/contato");
  await expect(page.getByRole("link", { name: "Enviar e-mail" })).toHaveAttribute(
    "href",
    "mailto:contato@example.com",
  );
});
