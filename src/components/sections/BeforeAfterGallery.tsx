import { homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import OptionalImage from "../ui/OptionalImage";

export function BeforeAfterGallery() {
  const section = homepageConfig.sections.beforeAfterGallery;

  if (!section.items.length) return null;

  return (
    <section
      id="results"
      className="bg-slate-50/90 py-16 sm:py-20"
    >
      <Container className="space-y-12">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          align="left"
        />

        <div className="grid gap-8 sm:grid-cols-2">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/40"
            >
              <div className="grid grid-cols-2 gap-px bg-slate-200/60 p-px">
                <div className="relative aspect-[3/4] bg-slate-50">
                  <OptionalImage
                    src={item.beforeSrc}
                    alt={item.alt ? `${item.alt} — Before` : "Before"}
                    placeholderLabel="Before"
                    className="absolute inset-0 h-full w-full rounded-none"
                  />
                </div>
                <div className="relative aspect-[3/4] bg-slate-50">
                  <OptionalImage
                    src={item.afterSrc}
                    alt={item.alt ? `${item.alt} — After` : "After"}
                    placeholderLabel="After"
                    className="absolute inset-0 h-full w-full rounded-none"
                  />
                </div>
              </div>
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-sm font-medium text-slate-800">
                  {item.treatment ?? "Featured result"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {section.disclaimer ? (
          <p className="text-xs font-light text-slate-500">{section.disclaimer}</p>
        ) : null}
      </Container>
    </section>
  );
}

export default BeforeAfterGallery;
