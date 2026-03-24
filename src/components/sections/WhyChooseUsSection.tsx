import { brandConfig, homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";
import { AppLink } from "../ui/AppLink";

export function WhyChooseUsSection() {
  const section = homepageConfig.sections.whyChooseUs;

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="space-y-12">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          align="left"
        />

        <div className="grid gap-8 sm:grid-cols-3">
          {section.items.map((item) => (
            <Card key={item.title} className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="flex-1 text-sm font-light leading-relaxed text-slate-600">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

        {section.cta ? (
          <div className="pt-2">
            <AppLink
              href={
                section.cta.href === "#book"
                  ? brandConfig.brand.ctas.book.href
                  : section.cta.href
              }
              className="text-sm font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
            >
              {section.cta.label}
            </AppLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default WhyChooseUsSection;
