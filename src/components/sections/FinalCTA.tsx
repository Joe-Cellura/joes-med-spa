import { brandConfig, homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { AppLink } from "../ui/AppLink";
import { toTelHref } from "../../lib/utils";

export function FinalCTA() {
  const section = homepageConfig.sections.finalCta;
  const { brand } = brandConfig;

  const secondaryHref =
    section.secondaryCta?.href === "tel"
      ? toTelHref(brand.contact.phone)
      : section.secondaryCta?.href;

  return (
    <section className="bg-slate-100/40 py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white px-6 py-10 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex sm:items-center sm:justify-between sm:gap-10 sm:px-10 sm:py-12">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {section.title}
            </h2>
            <p className="max-w-xl text-sm font-light leading-relaxed text-slate-600">
              {section.body}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
            <AppLink href={section.primaryCta.href}>
              <Button className="w-full min-w-[180px] px-6 py-3 sm:w-auto">
                {section.primaryCta.label}
              </Button>
            </AppLink>
            {section.secondaryCta && secondaryHref ? (
              <a href={secondaryHref} className="block">
                <Button variant="outline" className="w-full min-w-[140px] sm:w-auto">
                  {section.secondaryCta.label}
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTA;
