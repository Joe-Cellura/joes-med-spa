import Link from "next/link";
import { brandConfig } from "../../lib/content";
import { toTelHref } from "../../lib/utils";
import Container from "../ui/Container";
import Button from "../ui/Button";

export function Navbar() {
  const { brand, navigation } = brandConfig;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-teal-700">
            LA
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              {brand.name}
            </span>
            <span className="text-xs text-slate-500">
              {brand.location.display}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navigation.main.map((link) => (
            <Link
              key={link.href}
              href={
                link.href === "#book"
                  ? "/book"
                  : link.href.startsWith("#")
                  ? `/${link.href}`
                  : link.href
              }
              className="transition-colors hover:text-teal-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={toTelHref(brand.contact.phone)}
            className="text-sm font-medium text-slate-600 hover:text-teal-600"
          >
            {brand.contact.phone}
          </a>
          <Link href="/book">
            <Button className="px-5 py-2 text-sm">
              {brand.ctas.book.label}
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}

export default Navbar;
