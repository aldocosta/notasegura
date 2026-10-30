import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-canvas">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="rounded-xs text-lg font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {SITE_NAME}
        </Link>
      </div>
    </header>
  );
}
