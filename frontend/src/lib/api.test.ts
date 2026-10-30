import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createNote, getNote } from "./api";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue(Response.json({ id: "abc", url: "/n/abc", text: "hi" }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("api client", () => {
  it("createNote posts JSON to /api/notes", async () => {
    const input = { text: "hi", expiresInDays: 1, maxViews: 1 };
    await createNote(input);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/notes");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual(input);
  });

  it("getNote requests /api/notes/:id with encoded passphrase", async () => {
    await getNote("abc", "x y");

    expect(fetchMock.mock.calls[0][0]).toBe("/api/notes/abc?passphrase=x%20y");
  });

  it("getNote omits query string without passphrase", async () => {
    await getNote("abc");

    expect(fetchMock.mock.calls[0][0]).toBe("/api/notes/abc");
  });
});
