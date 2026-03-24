import {
  brandConfig,
  getFeaturedTestimonials,
  homepageConfig,
  testimonialsConfig,
} from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";
import { AppLink } from "../ui/AppLink";

export function TestimonialsSection() {
  const section = homepageConfig.sections.testimonials;
  const items = getFeaturedTestimonials();

  if (!items.length) return null;

  return (
    <section
      id="testimonials"
      className="bg-slate-100/40 py-16 sm:py-20"
    >
      <Container className="space-y-12">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          align="left"
        />

        <div className="grid gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="flex min-h-[200px] flex-col justify-between">
              <p className="text-sm font-light leading-relaxed text-slate-700">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-slate-200/60 pt-4 text-sm">
                <span className="font-semibold text-slate-900">{item.name}</span>
                {item.treatment ? (
                  <span className="font-light text-slate-500"> · {item.treatment}</span>
                ) : null}
              </div>
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

        {testimonialsConfig.disclaimer ? (
          <p className="text-xs font-light text-slate-500">{testimonialsConfig.disclaimer}</p>
        ) : null}
      </Container>
    </section>
  );
}

export default TestimonialsSection;
