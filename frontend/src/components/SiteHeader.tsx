import Link from "next/link";
import { Logo } from "@/components/Logo";
import SiteNav from "@/components/SiteNav";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="relative border-b border-hairline bg-canvas">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>
        <nav aria-label="Principal">
          <SiteNav />
        </nav>
      </div>
    </header>
  );
}
