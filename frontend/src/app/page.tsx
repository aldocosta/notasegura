"use client";

import { useState } from "react";
import { createNote } from "@/lib/api";

export default function Home() {
  const [text, setText] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [days, setDays] = useState(1);
  const [views, setViews] = useState(1);
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createNote({
        text,
        passphrase: passphrase || undefined,
        expiresInDays: days,
        maxViews: views,
      });
      setLink(`${window.location.origin}/n/${res.id}`);
    } catch {
      setError("Falha ao criar nota. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas text-body">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold text-primary">Nota Segura - BR</span>
        </div>
      </header>

      <section className="bg-gradient-to-b from-primary to-primary-deep px-4 py-12 text-on-primary sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold sm:text-4xl">Compartilhe textos sensíveis com segurança</h1>
          <p className="mt-3 text-sm opacity-90 sm:text-base">
            Notas anônimas, criptografadas e autodestrutivas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded border border-hairline-strong bg-mint-50 p-5 sm:p-7">
          <h2 className="text-lg font-bold text-ink sm:text-xl">Criar uma nota</h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded border border-hairline-strong bg-canvas p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
              placeholder="Escreva seu segredo aqui..."
            />
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Frase secreta opcional"
              className="w-full rounded border border-hairline-strong bg-canvas p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-muted">Expiração (dias 1-7)</span>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full rounded border border-hairline-strong bg-canvas p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted">Máximo de visualizações (1-10)</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value))}
                  className="w-full rounded border border-hairline-strong bg-canvas p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-deep disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Criando..." : "Criptografar e criar link"}
            </button>
            {error && <p className="text-sm text-error">{error}</p>}
          </form>
          {link && (
            <div className="mt-4 rounded border border-hairline-strong bg-canvas p-3 text-sm">
              <p className="text-muted">Compartilhe este link:</p>
              <code className="break-all text-primary">{link}</code>
            </div>
          )}
        </div>
      </section>

      <aside className="mx-auto max-w-5xl px-4 py-2 text-center text-xs text-faint sm:px-6">
        {/* ads/add-ons placeholder (<=8% screen) */}
        <div className="h-6" />
      </aside>
    </main>
  );
}