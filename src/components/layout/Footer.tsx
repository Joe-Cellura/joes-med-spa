import Link from "next/link";
import { brandConfig, homepageConfig } from "../../lib/content";
import { toTelHref } from "../../lib/utils";
import Container from "../ui/Container";

export function Footer() {
  const { brand, navigation, legal } = brandConfig;
  const note = homepageConfig.sections.footer.note;

  return (
    <footer className="border-t border-slate-200/60 bg-slate-100/50 py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {brand.name}
          </p>
          <p className="text-sm text-slate-600">{brand.location.display}</p>
          <p className="text-sm text-slate-600">
            <a
              href={toTelHref(brand.contact.phone)}
              className="hover:text-teal-600"
            >
              {brand.contact.phone}
            </a>
            {brand.contact.email ? (
              <>
                {" · "}
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="hover:text-teal-600"
                >
                  {brand.contact.email}
                </a>
              </>
            ) : null}
          </p>
          {brand.contact.addressLines ? (
            <p className="text-xs text-slate-500">
              {brand.contact.addressLines.join(", ")}
            </p>
          ) : null}
          {note ? (
            <p className="pt-2 text-xs text-slate-400">{note}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav className="flex flex-wrap gap-4">
            {navigation.footer.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-teal-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {legal?.disclaimerShort ? (
            <p className="max-w-sm text-xs text-slate-500">
              {legal.disclaimerShort}
            </p>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
