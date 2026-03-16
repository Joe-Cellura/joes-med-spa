import { homepageConfig } from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import OptionalImage from "../ui/OptionalImage";

export function AboutSection() {
  const section = homepageConfig.sections.about;

  return (
    <section
      id="about"
      className="bg-white py-16 sm:py-20"
    >
      <Container className="grid gap-14 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-20">
        <div className="space-y-6">
          <SectionHeader title={section.title} align="left" />
          <p className="max-w-lg text-base font-light leading-relaxed text-slate-600">
            {section.body}
          </p>
          {section.bullets && section.bullets.length > 0 ? (
            <ul className="space-y-2.5">
              {section.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-light text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative aspect-[4/3] w-full">
          <OptionalImage
            src={section.image?.src}
            alt={section.image?.alt ?? "About Lumina Aesthetics"}
            placeholderLabel="Studio Image"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </Container>
    </section>
  );
}

export default AboutSection;
