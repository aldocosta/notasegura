import Link from "next/link";
import { SITE_NAME, TRUST_PAGES } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-canvas-soft text-sm text-body">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {TRUST_PAGES.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="rounded-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted">
          © {year} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
