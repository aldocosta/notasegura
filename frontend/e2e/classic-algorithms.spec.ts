import { test, expect, type Page } from "@playwright/test";

const SAMPLE = "Olá, mundo! 123";
const ENIGMA_NOTE = "A Enigma só tinha letras maiúsculas.";

function card(page: Page) {
  return page.locator("#testar-algoritmos");
}

function valueOf(page: Page, label: string) {
  return card(page).locator(`dt:text-is("${label}") + dd`);
}

function field(page: Page, label: string) {
  return card(page).getByLabel(label, { exact: true });
}

async function select(page: Page, name: string) {
  await card(page).getByRole("group", { name: "Algoritmos" }).getByRole("button", { name, exact: true }).click();
}

async function run(page: Page, text: string, action = "Encriptar") {
  await field(page, "Texto").fill(text);
  await card(page).getByRole("button", { name: action, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ status: 200, body: "" }));
});

test("classic examples", async ({ page }) => {
  await page.goto("/");

  await select(page, "Máquina Enigma");
  await expect(field(page, "Posição inicial")).toHaveValue("AAA");
  await run(page, "AAAAA");
  await expect(valueOf(page, "Resultado")).toHaveText("BDZGO");

  await select(page, "Cifra de Playfair");
  await field(page, "Palavra-chave").fill("PLAYFAIREXAMPLE");
  await run(page, "Hide the gold in the tree stump");
  await expect(valueOf(page, "Resultado")).toHaveText("BMODZBXDNABEKUDMUIXMMOUVIF");

  await select(page, "Cerca de trilho");
  await expect(field(page, "Trilhos")).toHaveValue("3");
  await run(page, "WEAREDISCOVEREDFLEEATONCE");
  await expect(valueOf(page, "Resultado")).toHaveText("WECRLTEERDSOEEFEAOCAIVDEN");

  await select(page, "Hexadecimal");
  await run(page, "olá", "Codificar");
  await expect(valueOf(page, "Resultado")).toHaveText("6f6cc3a1");

  await select(page, "ROT13");
  await run(page, "Hello, World!");
  await expect(valueOf(page, "Resultado")).toHaveText("Uryyb, Jbeyq!");

  await select(page, "Cifra Atbash");
  await run(page, "Abc, xyz!");
  await expect(valueOf(page, "Resultado")).toHaveText("Zyx, cba!");
});

test("exact round trips", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Hexadecimal", "ROT13", "Cifra Atbash", "Cerca de trilho", "Cifra de Vernam"]) {
    const encoding = name === "Hexadecimal";
    await select(page, name);
    await run(page, SAMPLE, encoding ? "Codificar" : "Encriptar");
    const result = valueOf(page, "Resultado");
    await expect(result, name).toBeVisible();
    expect((await result.textContent())?.trim(), name).not.toBe(SAMPLE);
    await card(page)
      .getByRole("button", { name: encoding ? "Decodificar" : "Decifrar", exact: true })
      .click();
    await expect(valueOf(page, encoding ? "Texto decodificado" : "Texto decifrado"), name).toHaveText(SAMPLE);
  }
});

test("Enigma round trip in uppercase", async ({ page }) => {
  await page.goto("/");
  await select(page, "Máquina Enigma");
  await field(page, "Posição inicial").fill("QWE");
  await run(page, "Ataque ao amanhecer");
  await expect(valueOf(page, "Resultado")).toHaveText(/\S/);
  await card(page).getByRole("button", { name: "Decifrar", exact: true }).click();
  await expect(valueOf(page, "Texto decifrado")).toHaveText("ATAQUE AO AMANHECER");
  await expect(card(page).getByText(ENIGMA_NOTE)).toBeVisible();
});

test("rejects bad inputs", async ({ page }) => {
  await page.goto("/");

  await select(page, "Máquina Enigma");
  await field(page, "Posição inicial").fill("A1");
  await run(page, "segredo");
  await expect(card(page).getByRole("alert")).toHaveText("A posição inicial deve ter três letras de A a Z.");
  await expect(valueOf(page, "Resultado")).toHaveCount(0);

  await select(page, "Cerca de trilho");
  await field(page, "Trilhos").fill("11");
  await run(page, "segredo");
  await expect(card(page).getByRole("alert")).toHaveText("O número de trilhos deve ser um inteiro de 2 a 10.");
  await expect(valueOf(page, "Resultado")).toHaveCount(0);
});

test("25 buttons fit on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(card(page).getByRole("group", { name: "Algoritmos" }).getByRole("button")).toHaveCount(25);
  await select(page, "Máquina Enigma");
  await expect(field(page, "Posição inicial")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
