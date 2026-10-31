"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SafetyBadge from "@/components/SafetyBadge";
import { algorithmHref } from "@/lib/algorithms/href";
import { ALGORITHMS } from "@/lib/playground";
import type { AlgorithmId, EncryptResult } from "@/lib/playground/types";
import { MAX_TEXT_LENGTH, validateInput } from "@/lib/playground/validate";
import { WebCryptoUnavailableError } from "@/lib/playground/web-crypto";
import { ALGORITHMS_PATH } from "@/lib/site";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
const FIELD_CLASS =
  "w-full rounded border border-hairline-strong bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const UNSUPPORTED_MESSAGE = "Seu navegador não permite criptografia nesta página.";
const FAILURE_MESSAGE = "Não foi possível concluir a operação. Tente novamente.";

const LINK_CLASS = `rounded-xs font-bold text-primary hover:underline ${FOCUS_RING}`;

function failureMessage(err: unknown): string {
  return err instanceof WebCryptoUnavailableError ? UNSUPPORTED_MESSAGE : FAILURE_MESSAGE;
}

export default function CryptoPlayground({ initialAlgorithm = ALGORITHMS[0].id }: { initialAlgorithm?: AlgorithmId }) {
  const ids = useId();
  const pathname: string | null = usePathname();
  const runRef = useRef(0);
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>(initialAlgorithm);
  const [text, setText] = useState("");
  const [shift, setShift] = useState("3");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<EncryptResult | null>(null);
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const algorithm = ALGORITHMS.find((a) => a.id === algorithmId) ?? ALGORITHMS[0];

  function reset() {
    runRef.current++;
    setResult(null);
    setDecrypted(null);
    setError(null);
    setBusy(false);
  }

  function select(id: AlgorithmId) {
    setAlgorithmId(id);
    reset();
  }

  async function encrypt(e: React.FormEvent) {
    e.preventDefault();
    reset();
    const options = { shift: Number(shift), keyword };
    const message = validateInput(algorithm.id, text, options);
    if (message) {
      setError(message);
      return;
    }

    const run = runRef.current;
    setBusy(true);
    try {
      const encrypted = await algorithm.encrypt(text, options);
      if (run === runRef.current) setResult(encrypted);
    } catch (err) {
      if (run === runRef.current) setError(failureMessage(err));
    } finally {
      if (run === runRef.current) setBusy(false);
    }
  }

  async function decrypt() {
    if (!result?.decrypt) return;
    const run = runRef.current;
    try {
      const plain = await result.decrypt();
      if (run === runRef.current) setDecrypted(plain);
    } catch (err) {
      if (run === runRef.current) setError(failureMessage(err));
    }
  }

  return (
    <div className="rounded border border-hairline-strong bg-mint-50 p-5 sm:p-7">
      <h2 className="text-lg font-bold text-ink sm:text-xl">Teste os algoritmos</h2>
      <p className="mt-2 text-sm text-muted">
        Escolha um algoritmo, escreva um texto e veja como ele fica. Tudo acontece no seu navegador e nada é salvo.
      </p>

      <div role="group" aria-label="Algoritmos" className="mt-4 flex flex-wrap gap-2">
        {ALGORITHMS.map((a) => {
          const pressed = a.id === algorithm.id;
          const color = pressed
            ? "border-primary bg-primary text-on-primary"
            : "border-hairline-strong bg-canvas-soft text-primary hover:bg-mint-100";
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => select(a.id)}
              className={`rounded-xs border px-3 py-2 text-sm font-bold ${color} ${FOCUS_RING}`}
            >
              {a.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded border border-hairline-strong bg-canvas p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-ink">{algorithm.name}</h3>
          <SafetyBadge safety={algorithm.safety} />
        </div>
        <p className="mt-1 text-xs font-bold text-muted">{algorithm.kind}</p>
        {algorithm.summary.map((paragraph) => (
          <p key={paragraph} className="mt-2 text-sm text-body">
            {paragraph}
          </p>
        ))}
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {pathname !== algorithmHref(algorithm.id) && (
            <Link href={algorithmHref(algorithm.id)} className={LINK_CLASS}>
              Saiba mais sobre {algorithm.name}
            </Link>
          )}
          <Link href={ALGORITHMS_PATH} className={LINK_CLASS}>
            Ver todos os algoritmos
          </Link>
        </p>
      </div>

      <form onSubmit={encrypt} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor={`${ids}-texto`} className="mb-1 block text-sm text-muted">
            Texto para encriptar
          </label>
          <textarea
            id={`${ids}-texto`}
            value={text}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className={`${FIELD_CLASS} p-3`}
          />
          <p className="mt-1 text-right text-xs text-muted">
            {text.length}/{MAX_TEXT_LENGTH}
          </p>
        </div>

        {algorithm.id === "cesar" && (
          <div>
            <label htmlFor={`${ids}-deslocamento`} className="mb-1 block text-sm text-muted">
              Deslocamento
            </label>
            <input
              id={`${ids}-deslocamento`}
              type="number"
              inputMode="numeric"
              min={1}
              max={25}
              step={1}
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className={`${FIELD_CLASS} p-2 sm:max-w-40`}
            />
          </div>
        )}

        {algorithm.id === "vigenere" && (
          <div>
            <label htmlFor={`${ids}-palavra-chave`} className="mb-1 block text-sm text-muted">
              Palavra-chave
            </label>
            <input
              id={`${ids}-palavra-chave`}
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={`${FIELD_CLASS} p-2 sm:max-w-60`}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className={`w-full rounded bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-deep disabled:opacity-60 sm:w-auto ${FOCUS_RING}`}
        >
          {busy ? "Encriptando..." : "Encriptar"}
        </button>
        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
      </form>

      <div aria-live="polite" className="mt-4">
        {result && (
          <div className="space-y-4 rounded border border-hairline-strong bg-canvas p-4 text-sm">
            <dl className="space-y-3">
              <div>
                <dt className="font-bold text-ink">Resultado</dt>
                <dd className="mt-1">
                  <code className="block break-all text-primary">{result.output}</code>
                </dd>
              </div>
              {result.details.map((detail) => (
                <div key={detail.label}>
                  <dt className="font-bold text-ink">{detail.label}</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-muted">{detail.value}</dd>
                </div>
              ))}
            </dl>

            {result.decrypt ? (
              <button
                type="button"
                onClick={decrypt}
                className={`rounded-xs border border-primary bg-canvas-soft px-4 py-2 text-sm font-bold text-primary hover:bg-mint-100 ${FOCUS_RING}`}
              >
                Decifrar
              </button>
            ) : (
              <p className="text-muted">
                Um hash não pode ser desfeito: não existe chave para voltar ao texto original.
              </p>
            )}

            {decrypted !== null && (
              <dl>
                <div>
                  <dt className="font-bold text-ink">Texto decifrado</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words">{decrypted}</dd>
                </div>
              </dl>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
