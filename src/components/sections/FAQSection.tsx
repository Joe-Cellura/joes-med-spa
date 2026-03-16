import { getFeaturedFaqItems, homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";

export function FAQSection() {
  const section = homepageConfig.sections.faq;
  const items = getFeaturedFaqItems();

  if (!items.length) return null;

  return (
    <section
      id="faq"
      className="bg-slate-50/90 py-16 sm:py-20"
    >
      <Container className="space-y-12">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          align="left"
        />

        <div className="max-w-3xl divide-y divide-slate-200/70 rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {items.map((item) => (
            <details
              key={item.id}
              className="group px-6 py-4 sm:px-7"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                <span className="text-sm font-medium text-slate-900">
                  {item.question}
                </span>
                <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm font-light leading-relaxed text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FAQSection;
