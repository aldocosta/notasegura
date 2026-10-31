import { test, expect, type Page } from "@playwright/test";

const ALGORITHMS: Array<[string, string]> = [
  ["aes-gcm", "AES-256-GCM"],
  ["chacha20-poly1305", "ChaCha20-Poly1305"],
  ["aes-cbc", "AES-256-CBC"],
  ["aes-ctr", "AES-256-CTR"],
  ["rsa-oaep", "RSA-OAEP"],
  ["sha-256", "SHA-256"],
  ["sha-512", "SHA-512"],
  ["sha-1", "SHA-1"],
  ["md5", "MD5"],
  ["hmac-sha-256", "HMAC-SHA-256"],
  ["ecdsa", "ECDSA"],
  ["ed25519", "Ed25519"],
  ["rsa-pss", "RSA-PSS"],
  ["ecdh", "ECDH"],
  ["pbkdf2", "PBKDF2"],
  ["base64", "Base64"],
  ["hex", "Hexadecimal"],
  ["cesar", "Cifra de César"],
  ["rot13", "ROT13"],
  ["atbash", "Cifra Atbash"],
  ["vigenere", "Cifra de Vigenère"],
  ["playfair", "Cifra de Playfair"],
  ["rail-fence", "Cerca de trilho"],
  ["enigma", "Máquina Enigma"],
  ["vernam", "Cifra de Vernam"],
];
const SECTION_TITLES = ["O que é", "Como funciona", "Exemplo", "Onde é usado", "Pontos fortes e fracos", "Quando usar"];
const CLIENT = "ca-pub-1234567890123456";

function countTags(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, "g")) ?? []).length;
}

function expectInOrder(html: string, needles: string[], label: string) {
  const positions = needles.map((needle) => html.indexOf(needle));
  for (const [i, position] of positions.entries()) {
    expect(position, `${label}: ${needles[i]}`).toBeGreaterThanOrEqual(0);
  }
  expect(positions, label).toEqual([...positions].sort((a, b) => a - b));
}

function mainNav(page: Page) {
  return page.locator('nav[aria-label="Principal"]');
}

function card(page: Page) {
  return page.locator("#testar-algoritmos");
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("index serves content without JavaScript", async ({ request }) => {
  const res = await request.get("/algoritmos");
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(countTags(html, "h1")).toBe(1);
  expect(countTags(html, "p")).toBeGreaterThanOrEqual(4);
  expectInOrder(
    html,
    ALGORITHMS.map(([id]) => `href="/algoritmos/${id}"`),
    "index links",
  );
});

test("each article serves its text without JavaScript", async ({ request }) => {
  for (const [id, name] of ALGORITHMS) {
    const res = await request.get(`/algoritmos/${id}`);
    expect(res.status(), id).toBe(200);
    const html = await res.text();
    expect(countTags(html, "h1"), id).toBe(1);
    expect(html, id).toContain(`<title>${name}: o que é e como funciona | Nota Segura - BR</title>`);
    expectInOrder(
      html,
      SECTION_TITLES.map((title) => `>${title}</h2>`),
      id,
    );
    expect(countTags(html, "p"), id).toBeGreaterThanOrEqual(8);
    expect(html, id).toContain('<meta name="description"');
  }
});

test("César article shows the example", async ({ request }) => {
  const html = await (await request.get("/algoritmos/cesar")).text();
  expect(html).toContain("Def, abc!");
});

test("unknown algorithm returns 404", async ({ request }) => {
  const res = await request.get("/algoritmos/rot47");
  expect(res.status()).toBe(404);
});

test("algorithm pages carry the AdSense code", async ({ request }) => {
  for (const path of ["/algoritmos", "/algoritmos/aes-gcm"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(
      new RegExp(`<script\\b[^>]*\\bsrc="[^"]*adsbygoogle\\.js\\?client=${CLIENT}[^"]*"[^>]*>`),
    );
    expect(html, path).toContain(`name="google-adsense-account" content="${CLIENT}"`);
  }
});

test("playground opens the article of the selected algorithm", async ({ page }) => {
  await page.goto("/");
  await card(page).getByRole("group", { name: "Algoritmos" }).getByRole("button", { name: "Cifra de César" }).click();
  await card(page).getByRole("link", { name: "Saiba mais sobre Cifra de César" }).click();
  await expect(page).toHaveURL(/\/algoritmos\/cesar$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    card(page).getByRole("group", { name: "Algoritmos" }).getByRole("button", { name: "Cifra de César" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("playground works on an article", async ({ page }) => {
  await page.goto("/algoritmos/base64");
  await card(page).getByLabel("Texto", { exact: true }).fill("olá");
  await card(page).getByRole("button", { name: "Codificar" }).click();
  await expect(card(page).locator('dt:text-is("Resultado") + dd')).toHaveText("b2zDoQ==");
});

test("menu opens the index", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await mainNav(page).getByRole("link", { name: "Algoritmos", exact: true }).click();
  await expect(page).toHaveURL(/\/algoritmos$/);
  await expect(mainNav(page).getByRole("link", { name: "Algoritmos", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("mobile menu opens the index", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menuButton = mainNav(page).getByRole("button", { name: "Menu", exact: true });
  await menuButton.click();
  await mainNav(page).getByRole("link", { name: "Algoritmos", exact: true }).click();
  await expect(page).toHaveURL(/\/algoritmos$/);
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("related links navigate", async ({ page }) => {
  await page.goto("/algoritmos/cesar");
  await page.getByRole("link", { name: "Ler sobre Cifra de Vigenère" }).click();
  await expect(page).toHaveURL(/\/algoritmos\/vigenere$/);
});

test("pages fit on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/algoritmos", ...ALGORITHMS.map(([id]) => `/algoritmos/${id}`)]) {
    await page.goto(path);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits, path).toBe(true);
  }
});
