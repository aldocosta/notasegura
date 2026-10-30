import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main className="flex-1 bg-canvas text-body">
      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
        <LogoMark size={64} className="mx-auto mb-4 block" />
        <h1 className="text-2xl font-bold text-ink sm:text-4xl">Página não encontrada</h1>
        <p className="mt-3 text-base text-muted">
          O endereço que você abriu não existe ou foi removido. Confira o link ou volte para a página inicial.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xs bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Voltar para o início
        </Link>
      </section>
    </main>
  );
}
