import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";

const providers = [
  {
    name: "Dr. Sarah Chen",
    initials: "SC",
    role: "Medical Director",
    bio: "Board-certified physician overseeing all medical aesthetics at Lumina. Dr. Chen sets clinical protocols and performs or supervises all injectable treatments, with a focus on facial balance and conservative dosing.",
  },
  {
    name: "Marcus Webb, PA-C",
    initials: "MW",
    role: "Lead Injector",
    bio: "Marcus has performed injectables for over eight years, specializing in neuromodulators and dermal fillers. He prioritizes natural movement and proportion, building treatment plans over time rather than doing too much at once.",
  },
  {
    name: "Elena Rivera",
    initials: "ER",
    role: "Licensed Aesthetician & Skin Specialist",
    bio: "Elena manages facials, chemical peels, and Hydrafacial treatments. Licensed in North Carolina with additional training in medical-grade treatments and sensitive skin care.",
  },
  {
    name: "Jordan Kim",
    initials: "JK",
    role: "Client Concierge & Consultation Coordinator",
    bio: "Jordan handles scheduling, intake, and the flow of your visit. He ensures every client feels informed and comfortable from the first call through follow-up care.",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="OUR TEAM"
          title="Meet Your Providers"
          subtitle="Every treatment at Lumina is performed or supervised by licensed medical professionals. You will always know who is caring for you."
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
