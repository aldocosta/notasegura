import { test, expect, type Page } from "@playwright/test";

const CATEGORIES: Array<[string, string[]]> = [
  ["Criptografia", ["AES-256-GCM", "ChaCha20-Poly1305", "AES-256-CBC", "AES-256-CTR", "RSA-OAEP"]],
  ["Hash", ["SHA-256", "SHA-512", "SHA-1", "MD5"]],
  ["Autenticação e assinatura", ["HMAC-SHA-256", "ECDSA", "Ed25519", "RSA-PSS"]],
  ["Troca e derivação de chaves", ["ECDH", "PBKDF2"]],
  ["Codificação", ["Base64", "Hexadecimal"]],
  [
    "Cifras clássicas",
    [
      "Cifra de César",
      "ROT13",
      "Cifra Atbash",
      "Cifra de Vigenère",
      "Cifra de Playfair",
      "Cerca de trilho",
      "Máquina Enigma",
      "Cifra de Vernam",
    ],
  ],
];
const HASHES: Array<[string, string]> = [
  [
    "SHA-512",
    "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
  ],
  ["SHA-1", "a9993e364706816aba3e25717850c26c9cd0d89d"],
  ["MD5", "900150983cd24fb0d6963f7d28e17f72"],
];
const VERIFIABLE: Array<[string, string, string]> = [
  ["HMAC-SHA-256", "Gerar código", "Texto"],
  ["ECDSA", "Assinar", "Texto"],
  ["Ed25519", "Assinar", "Texto"],
  ["RSA-PSS", "Assinar", "Texto"],
  ["PBKDF2", "Derivar chave", "Senha"],
];
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

async function run(page: Page, text: string, action: string, input = "Texto") {
  await card(page).getByLabel(input, { exact: true }).fill(text);
  await card(page).getByRole("button", { name: action, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("buttons are grouped in the server HTML", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const needles = CATEGORIES.flatMap(([category, names]) => [
    `aria-label="${category}"`,
    ...names.map((name) => `>${name}</button>`),
  ]);
  const positions = needles.map((needle) => html.indexOf(needle));
  for (const [i, position] of positions.entries()) {
    expect(position, needles[i]).toBeGreaterThanOrEqual(0);
  }
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
});

test("hash results", async ({ page }) => {
  await page.goto("/");
  for (const [name, digest] of HASHES) {
    await select(page, name);
    await run(page, "abc", "Gerar hash");
    await expect(valueOf(page, "Resultado"), name).toHaveText(digest);
    for (const back of ["Decifrar", "Decodificar", "Verificar"]) {
      await expect(card(page).getByRole("button", { name: back, exact: true }), `${name} ${back}`).toHaveCount(0);
    }
  }
});

test("round trip for the new ciphers", async ({ page }) => {
  await page.goto("/");
  for (const name of ["ChaCha20-Poly1305", "AES-256-CTR", "ECDH"]) {
    await select(page, name);
    await run(page, SAMPLE, "Encriptar");
    await expect(valueOf(page, "Resultado"), name).toBeVisible();
    await card(page).getByRole("button", { name: "Decifrar", exact: true }).click();
    await expect(valueOf(page, "Texto decifrado"), name).toHaveText(SAMPLE);
  }
});

test("verify accepts the text and rejects a change", async ({ page }) => {
  await page.goto("/");
  for (const [name, action, input] of VERIFIABLE) {
    await select(page, name);
    await run(page, "segredo", action, input);
    await expect(valueOf(page, "Resultado"), name).toBeVisible();
    const box = card(page).getByLabel("Texto para verificar");
    await expect(box, name).toHaveValue("segredo");
    await card(page).getByRole("button", { name: "Verificar", exact: true }).click();
    await expect(card(page).getByText("Válido: o texto confere com o resultado."), name).toBeVisible();
    await box.fill("segredO");
    await card(page).getByRole("button", { name: "Verificar", exact: true }).click();
    await expect(card(page).getByText("Inválido: o texto não confere com o resultado."), name).toBeVisible();
  }
});

test("ECDH secrets match", async ({ page }) => {
  await page.goto("/");
  await select(page, "ECDH");
  await run(page, "segredo", "Encriptar");
  const ana = valueOf(page, "Segredo calculado por Ana");
  await expect(ana).toHaveText(/\S/);
  await expect(valueOf(page, "Segredo calculado por Beto")).toHaveText((await ana.textContent()) ?? "");
});

test("fits on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await select(page, "ECDH");
  await run(page, "segredo", "Encriptar");
  await expect(valueOf(page, "Resultado")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/algoritmos");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
