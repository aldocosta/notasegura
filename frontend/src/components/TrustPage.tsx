import type { ReactNode } from "react";
import Link from "next/link";
import type { IconComponent } from "@/components/icons";
import { LogoMark } from "@/components/Logo";

export type TrustHighlight = {
  icon: IconComponent;
  title: string;
  text: string;
};

export type BreadcrumbItem = { name: string; href?: string };

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-xs text-on-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TrustPage({
  title,
  lead,
  icon: Icon,
  updatedAt,
  breadcrumb,
  highlights,
  children,
}: {
  title: string;
  lead: string;
  icon: IconComponent;
  updatedAt?: string;
  breadcrumb?: BreadcrumbItem[];
  highlights: TrustHighlight[];
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-canvas text-body">
      <section
        data-hero
        className="relative overflow-hidden bg-gradient-to-b from-primary to-primary-deep px-4 py-10 text-on-primary sm:px-6 sm:py-14"
      >
        <LogoMark
          tone="inverse"
          size={240}
          className="pointer-events-none absolute -right-12 top-1/2 hidden -translate-y-1/2 opacity-10 sm:block"
        />
        <div className="relative mx-auto max-w-3xl">
          {breadcrumb && <Breadcrumb items={breadcrumb} />}
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-on-primary/15">
            <Icon className="h-7 w-7 text-on-primary" />
          </span>
          <h1 className="mt-4 text-2xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-base opacity-90 sm:text-lg">{lead}</p>
          {updatedAt && (
            <p className="mt-4 inline-block rounded-full bg-on-primary/15 px-3 py-1 text-xs font-bold">
              Última atualização: {updatedAt}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl break-words px-4 pb-8 sm:px-6 sm:pb-12">
        <ul aria-label="Destaques" className="relative -mt-6 grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: HighlightIcon, title: highlightTitle, text }) => (
            <li key={highlightTitle} className="rounded-lg border border-hairline-strong bg-canvas p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-primary">
                <HighlightIcon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-bold text-ink">{highlightTitle}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-8 text-base leading-relaxed">{children}</div>
      </div>
    </main>
  );
}

export function TrustPart({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: IconComponent;
  children: ReactNode;
}) {
  const headingId = `${id}-titulo`;

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 border-b border-hairline pb-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-100 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 id={headingId} className="text-xl font-bold text-ink sm:text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function TrustSection({
  title,
  icon: Icon,
  tone = "plain",
  level = 2,
  children,
}: {
  title?: string;
  icon?: IconComponent;
  tone?: "plain" | "mint";
  level?: 2 | 3;
  children: ReactNode;
}) {
  const toneClass = tone === "mint" ? "rounded-lg bg-mint-50 p-5" : "";
  const Heading = level === 3 ? "h3" : "h2";

  return (
    <section className={`space-y-3 ${toneClass}`}>
      {title && (
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-100 text-primary">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <Heading className="text-lg font-bold text-ink sm:text-xl">{title}</Heading>
        </div>
      )}
      {children}
    </section>
  );
}
