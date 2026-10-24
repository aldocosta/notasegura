import { test, expect } from "@playwright/test";

const API = "http://localhost:3001";

test.describe("API business rules", () => {
  test("create/read note", async ({ request }) => {
    const res = await request.post(`${API}/api/notes`, { data: { text: "hi", expiresInDays: 1, maxViews: 1 } });
    expect(res.ok()).toBeTruthy();
    const { id } = await res.json();
    const get = await request.get(`${API}/api/notes/${id}`);
    expect(get.ok()).toBeTruthy();
    expect(await get.json()).toEqual({ text: "hi" });
  });

  test("maxViews enforcement", async ({ request }) => {
    const res = await request.post(`${API}/api/notes`, { data: { text: "x", expiresInDays: 1, maxViews: 2 } });
    const { id } = await res.json();
    await request.get(`${API}/api/notes/${id}`);
    await request.get(`${API}/api/notes/${id}`);
    const third = await request.get(`${API}/api/notes/${id}`);
    expect(third.status()).toBe(404);
  });

  test("passphrase required/optional/invalid", async ({ request }) => {
    const res = await request.post(`${API}/api/notes`, { data: { text: "secret", passphrase: "pw", expiresInDays: 1, maxViews: 2 } });
    const { id } = await res.json();
    expect((await request.get(`${API}/api/notes/${id}`)).status()).toBe(401);
    expect((await request.get(`${API}/api/notes/${id}?passphrase=wrong`)).status()).toBe(401);
    const ok = await request.get(`${API}/api/notes/${id}?passphrase=pw`);
    expect(ok.ok()).toBeTruthy();
  });

  test("not found 404", async ({ request }) => {
    const res = await request.get(`${API}/api/notes/000000000000000000000000`);
    expect(res.status()).toBe(404);
  });

  test("validation errors 400", async ({ request }) => {
    const badDays = await request.post(`${API}/api/notes`, { data: { text: "x", expiresInDays: 0, maxViews: 1 } });
    expect(badDays.status()).toBe(400);
    const badViews = await request.post(`${API}/api/notes`, { data: { text: "x", expiresInDays: 1, maxViews: 11 } });
    expect(badViews.status()).toBe(400);
    const missingText = await request.post(`${API}/api/notes`, { data: { expiresInDays: 1, maxViews: 1 } });
    expect(missingText.status()).toBe(400);
  });
});

test.describe("UI flows", () => {
  test("create note and read", async ({ page }) => {
    await page.goto("/");
    await page.fill("textarea", "hello e2e");
    await page.click("button:has-text('Criptografar e criar link')");
    await expect(page.locator("code")).toBeVisible();
    const link = await page.locator("code").textContent();
    await page.goto(link!);
    await expect(page.locator("pre")).toContainText("hello e2e");
  });

  test("passphrase flow UI", async ({ page, request }) => {
    const res = await request.post(`${API}/api/notes`, { data: { text: "secret ui", passphrase: "pw", expiresInDays: 1, maxViews: 2 } });
    const { id } = await res.json();
    await page.goto(`/n/${id}`);
    await expect(page.locator("text=requer uma frase secreta")).toBeVisible();
    await page.fill('input[type="password"]', "pw");
    await page.click("button:has-text('Desbloquear')");
    await expect(page.locator("pre")).toContainText("secret ui");
  });

  test("wrong passphrase shows error", async ({ page, request }) => {
    const res = await request.post(`${API}/api/notes`, { data: { text: "secret ui", passphrase: "pw", expiresInDays: 1, maxViews: 2 } });
    const { id } = await res.json();
    await page.goto(`/n/${id}`);
    await page.fill('input[type="password"]', "bad");
    await page.click("button:has-text('Desbloquear')");
    await expect(page.locator("text=Frase secreta incorreta")).toBeVisible();
  });

  test("consumed note shows expired", async ({ page, request }) => {
    const res = await request.post(`${API}/api/notes`, { data: { text: "once", expiresInDays: 1, maxViews: 1 } });
    const { id } = await res.json();
    await page.goto(`/n/${id}`);
    await expect(page.locator("pre")).toContainText("once");
    await page.goto(`/n/${id}`);
    await expect(page.locator("text=Nota não encontrada")).toBeVisible();
  });

  test("not found UI", async ({ page }) => {
    await page.goto("/n/doesnotexist123");
    await expect(page.locator("text=Nota não encontrada")).toBeVisible();
  });
});
