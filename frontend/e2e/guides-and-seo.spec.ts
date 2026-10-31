import { test, expect, type Page } from "@playwright/test";

const SITE = "https://notasegura.example";
const CLIENT = "ca-pub-1234567890123456";
const GUIDES: Array<[string, string]> = [
  ["aes-gcm-ou-chacha20-poly1305", "AES-256-GCM ou ChaCha20-Poly1305: qual escolher?"],
  ["sha-256-sha-1-ou-md5", "SHA-256, SHA-1 ou MD5: qual hash usar?"],
  ["criptografia-hash-ou-codificacao", "Criptografia, hash ou codificação: qual é a diferença?"],
  ["rsa-ou-curvas-elipticas", "RSA ou curvas elípticas: qual escolher?"],
  ["como-enviar-uma-senha-com-seguranca", "Como enviar uma senha com segurança"],
  ["o-que-e-uma-nota-autodestrutiva", "O que é uma nota autodestrutiva e quando usar"],
  ["o-que-e-criptografia-de-ponta-a-ponta", "O que é criptografia de ponta a ponta"],
  ["como-guardar-senhas", "Como guardar senhas de usuários com segurança"],
];
const AES_GCM_GUIDES = [
  "Ler o guia: AES-256-GCM ou ChaCha20-Poly1305: qual escolher?",
  "Ler o guia: Criptografia, hash ou codificação: qual é a diferença?",
  "Ler o guia: Como enviar uma senha com segurança",
];

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

function decode(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tags(html: string, name: string): Array<Record<string, string>> {
  return Array.from(html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g")), ([tag]) =>
    Object.fromEntries(Array.from(tag.matchAll(/([\w:-]+)="([^"]*)"/g), ([, key, value]) => [key, decode(value)])),
  );
}

function metaContent(html: string, key: string): string[] {
  return tags(html, "meta")
    .filter((tag) => tag.property === key || tag.name === key)
    .map((tag) => tag.content);
}

function jsonLd(html: string): Array<{ raw: string; data: Record<string, unknown> }> {
  return Array.from(
    html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    ([, raw]) => ({ raw, data: JSON.parse(raw) as Record<string, unknown> }),
  );
}

type Breadcrumb = { itemListElement: Array<{ position: number; name: string; item: string }> };

function seeAlso(page: Page) {
  return page.locator("section").filter({ has: page.getByRole("heading", { level: 2, name: "Veja também" }) });
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("index serves content without JavaScript", async ({ request }) => {
  const res = await request.get("/guias");
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(countTags(html, "h1")).toBe(1);
  expectInOrder(
    html,
    GUIDES.map(([slug]) => `href="/guias/${slug}"`),
    "index links",
  );
});

test("each guide serves its text without JavaScript", async ({ request }) => {
  for (const [slug, title] of GUIDES) {
    const res = await request.get(`/guias/${slug}`);
    expect(res.status(), slug).toBe(200);
    const html = await res.text();
    expect(countTags(html, "h1"), slug).toBe(1);
    expect(html, slug).toMatch(new RegExp(`<h1[^>]*>${title.replace(/[?]/g, "\\?")}</h1>`));
    expect(html, slug).toContain(`<title>${title} | Nota Segura - BR</title>`);
    const [description] = metaContent(html, "description");
    expect(description, slug).toBeDefined();
    expect(description.length, slug).toBeGreaterThanOrEqual(70);
    expect(description.length, slug).toBeLessThanOrEqual(160);
    if (slug === "como-enviar-uma-senha-com-seguranca") {
      expect(html, slug).toContain("outro canal");
    }
  }
});

test("unknown guide returns 404", async ({ request }) => {
  const res = await request.get("/guias/nao-existe");
  expect(res.status()).toBe(404);
});

test("comparison table structure", async ({ page }) => {
  await page.goto("/guias/sha-256-sha-1-ou-md5");
  const table = page.locator("table");
  await expect(table).toHaveCount(1);
  await expect(table.locator("caption")).not.toBeEmpty();
  await expect(table.locator('th[scope="col"]')).toHaveText(["Critério", "MD5", "SHA-1", "SHA-256"]);
  expect(await table.locator("tbody tr").count()).toBeGreaterThanOrEqual(4);
});

test("guides fit on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [slug] of GUIDES) {
    await page.goto(`/guias/${slug}`);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits, slug).toBe(true);
  }
});

test("cited algorithm link navigates", async ({ page }) => {
  await page.goto("/guias/aes-gcm-ou-chacha20-poly1305");
  await page.getByRole("link", { name: "Ler sobre ChaCha20-Poly1305" }).click();
  await expect(page).toHaveURL(/\/algoritmos\/chacha20-poly1305$/);
});

test("breadcrumb navigates", async ({ page }) => {
  await page.goto("/algoritmos/cesar");
  await page
    .getByRole("navigation", { name: "Trilha de navegação" })
    .getByRole("link", { name: "Algoritmos", exact: true })
    .click();
  await expect(page).toHaveURL(/\/algoritmos$/);
});

test("algorithm pages link the guides", async ({ page }) => {
  await page.goto("/algoritmos/aes-gcm");
  const guideLinks = seeAlso(page).getByRole("link", { name: /^Ler o guia:/ });
  await expect(guideLinks).toHaveText(AES_GCM_GUIDES);
  await page.goto("/algoritmos/rot13");
  await expect(page.getByRole("link", { name: /^Ler o guia:/ })).toHaveCount(0);
  await page.goto("/algoritmos");
  await page.getByRole("link", { name: "Ver todos os guias" }).click();
  await expect(page).toHaveURL(/\/guias$/);
});

test("content pages have canonical and sharing metadata", async ({ request }) => {
  const articles = ["/algoritmos/aes-gcm", "/guias/como-guardar-senhas"];
  for (const path of ["/sobre", "/privacidade", "/contato", "/algoritmos", "/guias", ...articles]) {
    const html = await (await request.get(path)).text();
    const canonical = tags(html, "link").filter((tag) => tag.rel === "canonical");
    expect(canonical.map((tag) => tag.href), path).toEqual([`${SITE}${path}`]);
    expect(metaContent(html, "og:url"), path).toEqual([`${SITE}${path}`]);
    expect(metaContent(html, "og:site_name"), path).toEqual(["Nota Segura - BR"]);
    expect(metaContent(html, "og:locale"), path).toEqual(["pt_BR"]);
    expect(metaContent(html, "og:type"), path).toEqual([articles.includes(path) ? "article" : "website"]);
    expect(metaContent(html, "twitter:card"), path).toEqual(["summary_large_image"]);
  }
});

test("every page has an absolute share image", async ({ request }) => {
  const expected: Array<[string, (url: string) => boolean]> = [
    ["/", (url) => url.startsWith(`${SITE}/opengraph-image`)],
    ["/algoritmos/aes-gcm", (url) => url.includes("/algoritmos/aes-gcm/opengraph-image")],
    ["/guias/como-guardar-senhas", (url) => url.includes("/guias/como-guardar-senhas/opengraph-image")],
  ];
  for (const path of ["/sobre", "/privacidade", "/contato", "/algoritmos", "/guias"]) {
    expected.push([path, (url) => url.startsWith(`${SITE}/opengraph-image`)]);
  }
  for (const [path, matches] of expected) {
    const html = await (await request.get(path)).text();
    const images = metaContent(html, "og:image");
    expect(images.length, path).toBeGreaterThan(0);
    expect(images.some(matches), `${path}: ${images.join(", ")}`).toBe(true);
    for (const url of images) {
      expect(url, path).toMatch(/^https:\/\//);
    }
  }
  for (const path of ["/algoritmos/aes-gcm", "/guias/como-guardar-senhas"]) {
    const images = metaContent(await (await request.get(path)).text(), "og:image");
    expect(images, path).toHaveLength(1);
    expect(images[0].endsWith(`${path}/opengraph-image`), `${path}: ${images[0]}`).toBe(true);
  }
});

test("share images are 1200 x 630 PNG", async ({ request }) => {
  for (const path of [
    "/opengraph-image",
    "/algoritmos/aes-gcm/opengraph-image",
    "/guias/como-guardar-senhas/opengraph-image",
  ]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toBe("image/png");
    const png = await res.body();
    expect(png.subarray(12, 16).toString("ascii"), path).toBe("IHDR");
    expect(png.readUInt32BE(16), path).toBe(1200);
    expect(png.readUInt32BE(20), path).toBe(630);
  }
});

test("structured data", async ({ request }) => {
  const enigma = jsonLd(await (await request.get("/algoritmos/enigma")).text());
  const article = enigma.find(({ data }) => data["@type"] === "Article")?.data;
  expect(article?.headline).toBe("Máquina Enigma: o que é e como funciona");
  expect(article?.url).toBe(`${SITE}/algoritmos/enigma`);
  const breadcrumb = enigma.find(({ data }) => data["@type"] === "BreadcrumbList")?.data as Breadcrumb | undefined;
  expect(breadcrumb?.itemListElement.map((i) => i.name)).toEqual(["Início", "Algoritmos", "Máquina Enigma"]);
  expect(breadcrumb?.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);

  const guias = jsonLd(await (await request.get("/guias")).text());
  const guiasBreadcrumb = guias.find(({ data }) => data["@type"] === "BreadcrumbList")?.data as Breadcrumb | undefined;
  expect(guiasBreadcrumb?.itemListElement.map((i) => i.name)).toEqual(["Início", "Guias"]);

  for (const { raw } of [...enigma, ...guias]) {
    expect(raw).not.toContain("<");
  }
});

test("guide pages carry the AdSense code", async ({ request }) => {
  for (const path of ["/guias", "/guias/rsa-ou-curvas-elipticas"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(
      new RegExp(`<script\\b[^>]*\\bsrc="[^"]*adsbygoogle\\.js\\?client=${CLIENT}[^"]*"[^>]*>`),
    );
    expect(html, path).toContain(`name="google-adsense-account" content="${CLIENT}"`);
  }
});
