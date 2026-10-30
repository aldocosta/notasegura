import Link from "next/link";
import type { ReactNode } from "react";

const CLASS_NAME =
  "rounded-xs text-link underline hover:text-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export default function TextLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={CLASS_NAME}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={CLASS_NAME}>
      {children}
    </a>
  );
}
