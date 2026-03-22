import Link from "next/link";
import { getFeaturedTreatments, homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export function FeaturedTreatments() {
  const section = homepageConfig.sections.featuredTreatments;
  const treatments = getFeaturedTreatments();

  if (!treatments.length) return null;

  return (
    <section
      id="treatments"
      className="bg-slate-100/40 py-16 sm:py-20"
    >
      <Container className="space-y-12">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          align="left"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <Card
              key={treatment.id}
              hover
              className="flex min-h-[280px] flex-col gap-5"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-teal-700">
                    {treatment.name}
                  </h3>
                  {treatment.badges?.map((badge) => (
                    <Badge key={badge}>{badge}</Badge>
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {treatment.tagline}
                </p>
              </div>
              <p className="flex-1 text-sm font-light leading-relaxed text-slate-600">
                {treatment.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 pt-5">
                <span className="text-xs font-medium text-slate-500">{treatment.duration}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {treatment.startingAt}
                </span>
              </div>
              <Link
                href={treatment.cta.href}
                className="text-sm font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
              >
                {treatment.cta.label}
              </Link>
            </Card>
          ))}
        </div>

        {section.sectionCta ? (
          <div className="pt-2">
            <Link
              href={section.sectionCta.href}
              className="text-sm font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
            >
              {section.sectionCta.label}
            </Link>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default FeaturedTreatments;
