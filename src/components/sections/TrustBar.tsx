import { homepageConfig } from "../../lib/content";
import Container from "../ui/Container";

export function TrustBar() {
  const trust = homepageConfig.sections.trustBar;

  if (!trust.items.length) return null;

  return (
    <section className="border-b border-slate-200/60 bg-slate-50/90 py-8">
      <Container className="grid gap-8 text-center sm:grid-cols-3">
        {trust.items.map((item) => (
          <div
            key={item.label + item.value}
            className="flex flex-col gap-1"
          >
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              {item.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {item.label}
            </span>
            {item.sublabel ? (
              <span className="text-xs font-light text-slate-500">{item.sublabel}</span>
            ) : null}
          </div>
        ))}
      </Container>
    </section>
  );
}

export default TrustBar;
