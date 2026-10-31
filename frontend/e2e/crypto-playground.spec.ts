import { test, expect, type Page } from "@playwright/test";

const NAMES = [
  "AES-256-GCM",
  "AES-256-CBC",
  "RSA-OAEP",
  "SHA-256",
  "Base64",
  "Cifra de César",
  "Cifra de Vigenère",
];
const REVERSIBLE = NAMES.filter((name) => name !== "SHA-256");
const AES_GCM_SUMMARY =
  "Padrão moderno de criptografia simétrica: a mesma chave cifra e decifra. O modo GCM também detecta se o texto cifrado foi alterado. É o algoritmo que o Nota Segura - BR usa para proteger as notas.";
const ABC_DIGEST = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
const SAMPLE = "Olá, mundo! 123";

function card(page: Page) {
  return page.locator("#testar-algoritmos");
}

function valueOf(page: Page, label: string) {
  return card(page).locator(`dt:text-is("${label}") + dd`);
}

async function select(page: Page, name: string) {
  await card(page).getByRole("group", { name: "Algoritmos" }).getByRole("button", { name, exact: true }).click();
}

async function encrypt(page: Page, text: string) {
  await card(page).getByLabel("Texto para encriptar").fill(text);
  await card(page).getByRole("button", { name: "Encriptar", exact: true }).click();
}

async function roundTrip(page: Page, name: string) {
  await select(page, name);
  if (name === "Cifra de Vigenère") {
    await card(page).getByLabel("Palavra-chave").fill("chave");
  }
  await encrypt(page, SAMPLE);
  const result = valueOf(page, "Resultado");
  await expect(result, name).toBeVisible();
  const output = (await result.textContent())?.trim() ?? "";
  expect(output, name).not.toBe("");
  expect(output, name).not.toBe(SAMPLE);
  await card(page).getByRole("button", { name: "Decifrar", exact: true }).click();
  await expect(valueOf(page, "Texto decifrado"), name).toHaveText(SAMPLE);
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("card is in the server HTML", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("Teste os algoritmos");
  for (const name of NAMES) {
    expect(html, name).toContain(`>${name}</button>`);
  }
  expect(html).toContain(AES_GCM_SUMMARY);
  expect(html).toMatch(/<button\b[^>]*\baria-pressed="true"[^>]*>AES-256-GCM<\/button>/);
});

test("round trip with every reversible algorithm", async ({ page }) => {
  await page.goto("/");
  for (const name of REVERSIBLE) {
    await roundTrip(page, name);
  }
});

test("AES gives a new result each time", async ({ page }) => {
  await page.goto("/");
  await select(page, "AES-256-GCM");
  await encrypt(page, "segredo");
  const result = valueOf(page, "Resultado");
  await expect(result).toBeVisible();
  const first = (await result.textContent())?.trim() ?? "";
  await card(page).getByRole("button", { name: "Encriptar", exact: true }).click();
  await expect(result).not.toHaveText(first);
  await expect(result).toHaveText(/\S/);
  const second = (await result.textContent())?.trim() ?? "";
  expect(second).not.toBe(first);
});

test("SHA-256 has no decrypt", async ({ page }) => {
  await page.goto("/");
  await select(page, "SHA-256");
  await encrypt(page, "abc");
  await expect(valueOf(page, "Resultado")).toHaveText(ABC_DIGEST);
  await expect(card(page).getByRole("button", { name: "Decifrar", exact: true })).not.toBeVisible();
});

test("RSA rejects long text", async ({ page }) => {
  await page.goto("/");
  await select(page, "RSA-OAEP");
  await encrypt(page, "a".repeat(191));
  await expect(card(page).getByRole("alert")).toContainText("190 bytes");
  await expect(valueOf(page, "Resultado")).toHaveCount(0);
});

test("no request leaves the page", async ({ page }) => {
  await page.goto("/");
  const urls: string[] = [];
  page.on("request", (req) => urls.push(req.url()));
  for (const name of REVERSIBLE) {
    await roundTrip(page, name);
  }
  await select(page, "SHA-256");
  await encrypt(page, "abc");
  await expect(valueOf(page, "Resultado")).toHaveText(ABC_DIGEST);
  expect(urls.filter((url) => url.includes("/api/"))).toEqual([]);
});

test("fits on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await select(page, "RSA-OAEP");
  await encrypt(page, "segredo");
  await expect(valueOf(page, "Resultado")).toBeVisible();
  await expect(valueOf(page, "Chave pública")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
