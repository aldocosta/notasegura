"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";

const MENU_ID = "menu-principal";
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

function linkClassName(current: boolean, layout: string): string {
  const color = current ? "text-primary underline underline-offset-4" : "text-body hover:text-primary";
  return `${layout} rounded-xs text-sm font-bold ${color} ${FOCUS_RING}`;
}

export default function SiteNav() {
  const pathname: string | null = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState<{ open: boolean; path: string | null }>({ open: false, path: null });
  const open = menu.open && menu.path === pathname;

  const close = () => setMenu({ open: false, path: pathname });

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setMenu((m) => ({ ...m, open: false }));
      buttonRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function renderLinks(layout: string) {
    return NAV_LINKS.map((link) => {
      const current = link.href === pathname;
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-current={current ? "page" : undefined}
            onClick={close}
            className={linkClassName(current, layout)}
          >
            {link.label}
          </Link>
        </li>
      );
    });
  }

  return (
    <>
      <ul className="hidden flex-wrap items-center justify-end gap-5 sm:flex">{renderLinks("")}</ul>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setMenu({ open: !open, path: pathname })}
        className={`rounded-xs border border-hairline-strong px-3 py-2 text-sm font-bold text-primary hover:bg-mint-50 sm:hidden ${FOCUS_RING}`}
      >
        Menu
      </button>
      {open && (
        <ul
          id={MENU_ID}
          className="absolute inset-x-0 top-full z-10 flex flex-col border-y border-hairline bg-canvas sm:hidden"
        >
          {renderLinks("block px-4 py-3")}
        </ul>
      )}
    </>
  );
}
