// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("BACKEND_URL", "http://backend:3000");
  fetchMock.mockResolvedValue(Response.json({ ok: true }, { status: 200 }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetchMock.mockReset();
});

describe("api proxy route", () => {
  it("forwards POST method, body and content-type to BACKEND_URL", async () => {
    const body = JSON.stringify({ text: "hi", expiresInDays: 1, maxViews: 1 });
    await POST(
      new Request("http://app.test/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      }),
    );

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://backend:3000/api/notes");
    expect(init.method).toBe("POST");
    expect(new TextDecoder().decode(init.body)).toBe(body);
    expect(init.headers.get("content-type")).toBe("application/json");
  });

  it("forwards query string unchanged", async () => {
    await GET(new Request("http://app.test/api/notes/abc?passphrase=x%20y"));

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://backend:3000/api/notes/abc?passphrase=x%20y",
    );
  });

  it("forwards x-forwarded-for from the incoming request", async () => {
    await GET(
      new Request("http://app.test/api/notes/abc", {
        headers: { "x-forwarded-for": "198.51.100.7" },
      }),
    );

    expect(fetchMock.mock.calls[0][1].headers.get("x-forwarded-for")).toBe(
      "198.51.100.7",
    );
  });

  it("returns backend status, body and Retry-After", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { message: "Too Many Requests" },
        { status: 429, headers: { "Retry-After": "42" } },
      ),
    );

    const res = await POST(
      new Request("http://app.test/api/notes", { method: "POST", body: "{}" }),
    );

    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("42");
    expect(await res.json()).toEqual({ message: "Too Many Requests" });
  });

  it("reads BACKEND_URL at request time", async () => {
    await GET(new Request("http://app.test/api/health"));
    vi.stubEnv("BACKEND_URL", "http://other:4000");
    await GET(new Request("http://app.test/api/health"));

    expect(fetchMock.mock.calls[0][0]).toBe("http://backend:3000/api/health");
    expect(fetchMock.mock.calls[1][0]).toBe("http://other:4000/api/health");
  });

  it("defaults to http://localhost:3001 when BACKEND_URL is unset", async () => {
    vi.stubEnv("BACKEND_URL", undefined);
    await GET(new Request("http://app.test/api/health"));

    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:3001/api/health");
  });

  it("returns 502 when the backend is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const res = await GET(new Request("http://app.test/api/notes/abc"));

    expect(res.status).toBe(502);
  });
});
