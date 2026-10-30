import type { ReactNode } from "react";

export function TrustPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-canvas text-body">
      <article className="mx-auto max-w-3xl break-words px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold text-ink sm:text-4xl">{title}</h1>
        {updatedAt && <p className="mt-2 text-xs text-muted">Última atualização: {updatedAt}</p>}
        <div className="mt-6 space-y-8 text-base leading-relaxed">{children}</div>
      </article>
    </main>
  );
}

export function TrustSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      {title && <h2 className="text-lg font-bold text-ink sm:text-xl">{title}</h2>}
      {children}
    </section>
  );
}
