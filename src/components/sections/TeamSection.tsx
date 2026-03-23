import { teamConfig, brandConfig } from "../../lib/content";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";

export default function TeamSection() {
  const providers = teamConfig.providers;
  return (
    <section id="team" className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="OUR TEAM"
          title="Meet Your Providers"
          subtitle={`Every treatment at ${brandConfig.brand.name} is performed by licensed professionals. You will always know who is caring for you.`}
          centered
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider.name} hover>
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-lg font-semibold text-teal-600">
                    {provider.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{provider.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-teal-600">
                    {provider.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {provider.bio}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
