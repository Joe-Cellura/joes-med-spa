export type NavLink = {
  label: string;
  href: string;
};

export type BrandTheme = {
  background: "white" | "neutral";
  accent: string;
  text: string;
  mutedText: string;
};

export type BrandConfig = {
  brand: {
    name: string;
    tagline: string;
    location: {
      city: string;
      region: string;
      display: string;
    };
    contact: {
      phone: string;
      email?: string;
      addressLines?: string[];
      hours?: string[];
    };
    ctas: {
      book: {
        label: string;
        href: string;
      };
    };
    social?: {
      instagram?: string;
      tiktok?: string;
      [key: string]: string | undefined;
    };
  };
  navigation: {
    main: NavLink[];
    footer: NavLink[];
  };
  theme: BrandTheme;
  legal?: {
    disclaimerShort?: string;
  };
};

export type PromoStripConfig = {
  enabled: boolean;
  badge?: string;
  message: string;
  link?: {
    label: string;
    href: string;
  };
};

export type HeroConfig = {
  eyebrow?: string;
  heading: string;
  subheading: string;
  highlights?: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
};

export type TrustItem = {
  label: string;
  value: string;
  sublabel?: string;
};

export type TrustBarConfig = {
  items: TrustItem[];
};

export type Treatment = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  startingAt: string;
  category?: string;
  badges?: string[];
  cta: {
    label: string;
    href: string;
  };
};

export type TreatmentsConfig = {
  items: Treatment[];
};

export type FeaturedTreatmentsConfig = {
  title: string;
  subtitle?: string;
  featuredIds: string[];
  sectionCta?: {
    label: string;
    href: string;
  };
};

export type WhyChooseUsItem = {
  title: string;
  description: string;
};

export type WhyChooseUsConfig = {
  title: string;
  subtitle?: string;
  items: WhyChooseUsItem[];
  cta?: {
    label: string;
    href: string;
  };
};

export type GalleryItem = {
  id: string;
  treatment?: string;
  beforeSrc?: string;
  afterSrc?: string;
  alt?: string;
};

export type BeforeAfterGalleryConfig = {
  title: string;
  subtitle?: string;
  items: GalleryItem[];
  disclaimer?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  treatment?: string;
  rating?: number;
};

export type TestimonialsData = {
  disclaimer?: string;
  items: Testimonial[];
};

export type TestimonialsSectionConfig = {
  title: string;
  subtitle?: string;
  featuredIds: string[];
  cta?: {
    label: string;
    href: string;
  };
};

export type AboutSectionConfig = {
  title: string;
  body: string;
  bullets?: string[];
  image?: {
    src: string;
    alt: string;
  };
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

export type FaqData = {
  items: FaqItem[];
};

export type FaqSectionConfig = {
  title: string;
  subtitle?: string;
  featuredIds: string[];
};

export type FinalCtaConfig = {
  title: string;
  body: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export type StickyMobileCtaItem =
  | {
      type: "call";
      label: string;
    }
  | {
      type: "book";
      label: string;
      href: string;
    }
  | {
      type: "chat";
      label: string;
    };

export type StickyMobileCtaConfig = {
  enabled: boolean;
  items: StickyMobileCtaItem[];
};

export type HomepageSectionsConfig = {
  promoStrip: PromoStripConfig;
  navbar: Record<string, never>;
  hero: HeroConfig;
  trustBar: TrustBarConfig;
  featuredTreatments: FeaturedTreatmentsConfig;
  whyChooseUs: WhyChooseUsConfig;
  beforeAfterGallery: BeforeAfterGalleryConfig;
  testimonials: TestimonialsSectionConfig;
  about: AboutSectionConfig;
  faq: FaqSectionConfig;
  finalCta: FinalCtaConfig;
  footer: {
    note?: string;
  };
  stickyMobileCta: StickyMobileCtaConfig;
};

export type HomepageConfig = {
  meta: {
    title: string;
    description: string;
  };
  sections: HomepageSectionsConfig;
};

export type ChatSuggestedQuestion = {
  id: string;
  label: string;
};

export type ChatMockQa = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

export type ChatConfig = {
  enabled: boolean;
  triggerLabel: string;
  panelTitle: string;
  welcomeTitle: string;
  welcomeMessage: string;
  disclaimer?: string;
  suggestedQuestions?: ChatSuggestedQuestion[];
  mockQa?: ChatMockQa[];
};

