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
          <a
            href="#como-funciona"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="mt-4 inline-block rounded bg-on-primary px-4 py-2 text-sm font-bold text-primary shadow hover:bg-white"
          >
            Como Funciona!
          </a>
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

      <section id="como-funciona" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="rounded border-2 border-primary bg-mint-50 p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-ink sm:text-xl">Como funciona</h2>
          <p className="mt-2 text-sm text-muted">
            Envie um texto sensível de forma anônima. O link criptografado some sozinho depois de um tempo ou de algumas leituras.
          </p>
          <ol className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">1</span>
              <div>
                <p className="font-semibold text-ink">Você escreve a nota</p>
                <p className="text-muted">Digite o segredo, escolha dias de validade (1-7) e quantas vezes pode ser aberto (1-10). Pode adicionar uma frase secreta opcional.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">2</span>
              <div>
                <p className="font-semibold text-ink">Recebe um link</p>
                <p className="text-muted">Exemplo: <code className="break-all text-primary">https://notasegura.app/n/abc123</code>. Compartilhe apenas com quem deve ver.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">3</span>
              <div>
                <p className="font-semibold text-ink">O destinatário abre e lê</p>
                <p className="text-muted">Quem tem o link pode ler a nota. Se você usou frase secreta, ela será pedida antes de exibir.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">4</span>
              <div>
                <p className="font-semibold text-ink">A nota se autodestrói</p>
                <p className="text-muted">Após expirar (dias ou visualizações), o link deixa de funcionar e o conteúdo é apagado.</p>
              </div>
            </li>
          </ol>
          <p className="mt-4 rounded border border-hairline-strong bg-mint-50 p-3 text-xs text-muted">
            Dica: use frases secretas para notas muito sensíveis. Nós nunca armazenamos a frase em texto claro, então se você esquecer, não há recuperação.
          </p>
        </div>
      </section>


      <aside className="mx-auto max-w-5xl px-4 py-2 text-center text-xs text-faint sm:px-6">
        {/* ads/add-ons placeholder (<=8% screen) */}
        <div className="h-6" />
      </aside>
    </main>
  );
}