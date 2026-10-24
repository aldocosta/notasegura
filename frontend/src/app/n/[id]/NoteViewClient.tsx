"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNote } from "@/lib/api";

export default function NoteViewClient({ id }: { id: string }) {
  const [passphrase, setPassphrase] = useState("");
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsPass, setNeedsPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load(pp?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getNote(id, pp);
      setText(res.text);
      setNeedsPass(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      if (msg === "410") setError("Esta nota expirou ou foi consumida.");
      else if (msg === "401" && !pp) setNeedsPass(true);
      else if (msg === "401") setError("Frase secreta incorreta.");
      else setError("Nota não encontrada.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className="min-h-screen bg-canvas text-body">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-primary">Nota Segura - BR</Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded border border-hairline-strong bg-mint-50 p-5 sm:p-7">
          <h2 className="text-lg font-bold text-ink sm:text-xl">Nota</h2>
          {loading && <p className="mt-4 text-sm text-muted">Carregando...</p>}
          {error && <p className="mt-4 text-sm text-error">{error}</p>}
          {needsPass && !text && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted">Esta nota requer uma frase secreta.</p>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full rounded border border-hairline-strong bg-canvas p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => load(passphrase)}
                className="rounded bg-primary px-6 py-2 text-sm font-semibold text-on-primary hover:bg-primary-deep"
              >
                Desbloquear
              </button>
            </div>
          )}
          {text && (
            <pre className="mt-4 whitespace-pre-wrap break-words rounded border border-hairline-strong bg-canvas p-4 text-sm text-ink">
              {text}
            </pre>
          )}
        </div>
      </section>
    </main>
  );
}