import Link from "next/link";
import { brandConfig, homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { AppLink } from "../ui/AppLink";
import OptionalImage from "../ui/OptionalImage";

export function HeroSection() {
  const { brand } = brandConfig;
  const hero = homepageConfig.sections.hero;

  return (
    <section
      id="top"
      className="bg-white py-16 sm:py-20 md:py-24"
    >
      <Container className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
        <div className="max-w-xl space-y-9">
          {hero.eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
              {hero.eyebrow}
            </p>
          ) : null}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-[-0.02em] text-slate-900 sm:text-5xl md:text-[3rem] md:leading-[1.15]">
              {hero.heading}
            </h1>
            <p className="max-w-md text-base font-light leading-[1.65] text-slate-600">
              {hero.subheading}
            </p>
          </div>
          {hero.highlights && hero.highlights.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {hero.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-slate-200/90 bg-white px-5 py-2.5 text-xs font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <AppLink href={hero.primaryCta.href}>
              <Button className="min-w-[180px] px-6 py-3 text-sm">
                {hero.primaryCta.label}
              </Button>
            </AppLink>
            {hero.secondaryCta ? (
              <Link href={hero.secondaryCta.href}>
                <Button variant="outline" className="min-w-[160px] px-5 py-2.5 text-sm">
                  {hero.secondaryCta.label}
                </Button>
              </Link>
            ) : null}
          </div>
          <p className="text-xs font-light text-slate-500">
            {brand.location.display} · Refined, natural-looking outcomes.
          </p>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-slate-100/70 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/40 sm:aspect-square md:aspect-[4/5]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.6),transparent)]" />
          <OptionalImage
            src={hero.image?.src}
            alt={hero.image?.alt ?? "Lumina Aesthetics"}
            placeholderLabel="Treatment Room Image"
            placeholderVariant="hero"
            className="absolute inset-0 h-full w-full rounded-3xl"
          />
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
