import { test, expect, type Page } from "@playwright/test";

const TRUST_PAGES = ["/sobre", "/privacidade", "/contato"];
const FOOTER_LINKS: Array<[string, string]> = [
  ["Sobre", "/sobre"],
  ["Privacidade e Termos", "/privacidade"],
  ["Contato", "/contato"],
];
const CLIENT = "ca-pub-1234567890123456";
const NOTE_PATH = "/n/abc123";
const UNKNOWN_PATH = "/pagina-que-nao-existe";

async function blockAdsense(page: Page) {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
}

function countTags(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, "g")) ?? []).length;
}

function robotsGroup(text: string, userAgent: string): string[] {
  const groups = text.split(/\r?\n\s*\r?\n/).map((g) => g.trim().split(/\r?\n/).map((l) => l.trim()));
  const group = groups.find((lines) => lines.includes(`User-Agent: ${userAgent}`));
  expect(group, `robots.txt group for ${userAgent}`).toBeDefined();
  return group!;
}

test.beforeEach(async ({ page }) => {
  await blockAdsense(page);
});

test("trust pages serve prose without JavaScript", async ({ request }) => {
  for (const path of TRUST_PAGES) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const html = await res.text();
    expect(countTags(html, "h1"), path).toBe(1);
    expect(countTags(html, "p"), path).toBeGreaterThanOrEqual(3);
  }
});

test("footer navigates between trust pages", async ({ page }) => {
  await page.goto("/sobre");
  await page
    .locator('nav[aria-label="Rodapé"]')
    .getByRole("link", { name: "Privacidade e Termos", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("header and footer appear on home, note, and 404 pages", async ({ page }) => {
  for (const path of ["/", NOTE_PATH, UNKNOWN_PATH]) {
    await page.goto(path);
    await expect(page.getByRole("link", { name: "Nota Segura - BR", exact: true }), path).toHaveAttribute("href", "/");
    const footer = page.locator('nav[aria-label="Rodapé"]');
    for (const [name, href] of FOOTER_LINKS) {
      await expect(footer.getByRole("link", { name, exact: true }), `${path} ${name}`).toHaveAttribute("href", href);
    }
  }
});

test("trust pages fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of TRUST_PAGES) {
    await page.goto(path);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits, path).toBe(true);
  }
});

test("content pages carry the AdSense code", async ({ request }) => {
  for (const path of ["/", "/privacidade"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(
      new RegExp(`<script\\b[^>]*\\bsrc="[^"]*adsbygoogle\\.js\\?client=${CLIENT}[^"]*"[^>]*>`),
    );
    expect(html, path).toContain(`name="google-adsense-account" content="${CLIENT}"`);
  }
});

test("note and 404 pages carry no AdSense code", async ({ request }) => {
  for (const path of [NOTE_PATH, UNKNOWN_PATH]) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toContain("adsbygoogle");
    expect(html, path).not.toContain("google-adsense-account");
  }
});

test("note page is not indexed", async ({ request }) => {
  const html = await (await request.get(NOTE_PATH)).text();
  expect(html).toContain('<meta name="robots" content="noindex, nofollow"');
});

test("robots.txt blocks notes for all crawlers", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const text = await res.text();
  for (const userAgent of ["*", "Mediapartners-Google"]) {
    const group = robotsGroup(text, userAgent);
    expect(group, userAgent).toEqual(expect.arrayContaining(["Allow: /", "Disallow: /n/", "Disallow: /api/"]));
  }
  expect(text).toContain("Sitemap: https://notasegura.example/sitemap.xml");
});

test("sitemap lists the public pages", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  const locs = Array.from(xml.matchAll(/<loc>([^<]*)<\/loc>/g), (m) => m[1].trim());
  expect(locs).toEqual([
    "https://notasegura.example",
    "https://notasegura.example/sobre",
    "https://notasegura.example/privacidade",
    "https://notasegura.example/contato",
    "https://notasegura.example/algoritmos",
    "https://notasegura.example/algoritmos/aes-gcm",
    "https://notasegura.example/algoritmos/chacha20-poly1305",
    "https://notasegura.example/algoritmos/aes-cbc",
    "https://notasegura.example/algoritmos/aes-ctr",
    "https://notasegura.example/algoritmos/rsa-oaep",
    "https://notasegura.example/algoritmos/sha-256",
    "https://notasegura.example/algoritmos/sha-512",
    "https://notasegura.example/algoritmos/sha-1",
    "https://notasegura.example/algoritmos/md5",
    "https://notasegura.example/algoritmos/hmac-sha-256",
    "https://notasegura.example/algoritmos/ecdsa",
    "https://notasegura.example/algoritmos/ed25519",
    "https://notasegura.example/algoritmos/rsa-pss",
    "https://notasegura.example/algoritmos/ecdh",
    "https://notasegura.example/algoritmos/pbkdf2",
    "https://notasegura.example/algoritmos/base64",
    "https://notasegura.example/algoritmos/hex",
    "https://notasegura.example/algoritmos/cesar",
    "https://notasegura.example/algoritmos/rot13",
    "https://notasegura.example/algoritmos/atbash",
    "https://notasegura.example/algoritmos/vigenere",
    "https://notasegura.example/algoritmos/playfair",
    "https://notasegura.example/algoritmos/rail-fence",
    "https://notasegura.example/algoritmos/enigma",
    "https://notasegura.example/algoritmos/vernam",
  ]);
  for (const loc of locs) {
    expect(loc).not.toContain("/termos");
  }
});

test("ads.txt is served", async ({ request }) => {
  const res = await request.get("/ads.txt");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toMatch(/^text\/plain/);
  expect(await res.text()).toBe("google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
});

test("unknown path returns 404", async ({ request, page }) => {
  const res = await request.get(UNKNOWN_PATH);
  expect(res.status()).toBe(404);
  await page.goto(UNKNOWN_PATH);
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar para o início" })).toHaveAttribute("href", "/");
});

test("contact page shows the email", async ({ page }) => {
  await page.goto("/contato");
  await expect(page.getByRole("link", { name: "contato@example.com" })).toHaveAttribute(
    "href",
    "mailto:contato@example.com",
  );
});
