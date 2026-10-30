export type CreateNoteInput = {
  text: string;
  passphrase?: string;
  expiresInDays: number;
  maxViews: number;
};

export async function createNote(input: CreateNoteInput): Promise<{ id: string; url: string }> {
const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function getNote(id: string, passphrase?: string): Promise<{ text: string }> {
  const qs = passphrase ? `?passphrase=${encodeURIComponent(passphrase)}` : "";
  const res = await fetch(`/api/notes/${id}${qs}`);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}