"use client";

import { useState } from "react";
import Link from "next/link";
import { brandConfig } from "../../lib/content";
import { toTelHref } from "../../lib/utils";
import Container from "../ui/Container";
import Button from "../ui/Button";

export function Navbar() {
  const { brand, navigation } = brandConfig;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resolveHref = (href: string) =>
    href === "#book" ? "/book" : href.startsWith("#") ? `/${href}` : href;

  const closeMenu = () => setIsMenuOpen(false);

  const mobileNavItems = navigation.main.filter(
    (link) => link.label !== "FAQ",
  );

  return (
    <header className="relative sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-teal-700">
            LA
          </span>
          <div className="flex flex-col">
            <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-slate-900">
              {brand.name}
            </span>
            <span className="text-xs text-slate-500">
              {brand.location.display}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 text-sm font-medium text-slate-600 md:flex lg:gap-4">
          {navigation.main.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="transition-colors hover:text-teal-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={toTelHref(brand.contact.phone)}
            className="hidden text-sm font-medium text-slate-600 hover:text-teal-600 lg:block"
          >
            {brand.contact.phone}
          </a>
          <Link href="/book">
            <Button className="px-5 py-2 text-sm">
              {brand.ctas.book.label}
            </Button>
          </Link>
        </div>

        {/* Mobile: Book Now + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/book">
            <Button className="px-4 py-2 text-sm">
              {brand.ctas.book.label}
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[999] bg-teal-600 md:hidden">
          <nav className="grid grid-cols-3">
            {mobileNavItems.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                onClick={closeMenu}
                className="border-b border-teal-500 px-4 py-5 text-center text-base font-light text-white transition-colors hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={toTelHref(brand.contact.phone)}
            onClick={closeMenu}
            className="block border-t border-teal-500 px-8 py-3 text-center text-sm text-teal-200"
          >
            {brand.contact.phone}
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
