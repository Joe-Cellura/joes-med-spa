import { ACTIVE_CLIENT } from "./client";
import type {
  BrandConfig,
  HomepageConfig,
  TreatmentsConfig,
  FaqData,
  TestimonialsData,
  ChatConfig,
  Treatment,
  FaqItem,
  Testimonial,
} from "./types";

import luminaBrand from "../data/clients/aura-skin-laser/brand.json";
import luminaHomepage from "../data/clients/aura-skin-laser/homepage.json";
import luminaTreatments from "../data/clients/aura-skin-laser/treatments.json";
import luminaFaq from "../data/clients/aura-skin-laser/faq.json";
import luminaTestimonials from "../data/clients/aura-skin-laser/testimonials.json";
import luminaChat from "../data/clients/aura-skin-laser/chat.json";
import luminaTeam from "../data/clients/aura-skin-laser/team.json";
import { blogPosts as luminaBlogPosts } from "../data/clients/aura-skin-laser/blogPosts";

import auraBrand from "../data/clients/aura-skin-laser/brand.json";
import auraHomepage from "../data/clients/aura-skin-laser/homepage.json";
import auraTreatments from "../data/clients/aura-skin-laser/treatments.json";
import auraFaq from "../data/clients/aura-skin-laser/faq.json";
import auraTestimonials from "../data/clients/aura-skin-laser/testimonials.json";
import auraChat from "../data/clients/aura-skin-laser/chat.json";
import auraTeam from "../data/clients/aura-skin-laser/team.json";
import { blogPosts as auraBlogPosts } from "../data/clients/aura-skin-laser/blogPosts";

import brightBrand from "../data/clients/aura-skin-laser/brand.json";
import brightHomepage from "../data/clients/aura-skin-laser/homepage.json";
import brightTreatments from "../data/clients/aura-skin-laser/treatments.json";
import brightFaq from "../data/clients/aura-skin-laser/faq.json";
import brightTestimonials from "../data/clients/aura-skin-laser/testimonials.json";
import brightChat from "../data/clients/aura-skin-laser/chat.json";
import brightTeam from "../data/clients/aura-skin-laser/team.json";
import { blogPosts as brightBlogPosts } from "../data/clients/aura-skin-laser/blogPosts";

import gloBrand from "../data/clients/aura-skin-laser/brand.json";
import gloHomepage from "../data/clients/aura-skin-laser/homepage.json";
import gloTreatments from "../data/clients/aura-skin-laser/treatments.json";
import gloFaq from "../data/clients/aura-skin-laser/faq.json";
import gloTestimonials from "../data/clients/aura-skin-laser/testimonials.json";
import gloChat from "../data/clients/aura-skin-laser/chat.json";
import gloTeam from "../data/clients/aura-skin-laser/team.json";
import { blogPosts as gloBlogPosts } from "../data/clients/aura-skin-laser/blogPosts";

const CLIENT_IDS = [
  "lumina",
  "aura-skin-laser",
  "bright-smile-dental",
  "glo-de-vie",
] as const;
type ClientId = (typeof CLIENT_IDS)[number];

function getClientId(): ClientId {
  if (!CLIENT_IDS.includes(ACTIVE_CLIENT as ClientId)) {
    throw new Error(`Unknown ACTIVE_CLIENT: ${ACTIVE_CLIENT}`);
  }
  return ACTIVE_CLIENT as ClientId;
}

const cid = getClientId();

const bundles = {
  lumina: {
    brand: luminaBrand,
    homepage: luminaHomepage,
    treatments: luminaTreatments,
    faq: luminaFaq,
    testimonials: luminaTestimonials,
    chat: luminaChat,
    team: luminaTeam,
    blogPosts: luminaBlogPosts,
  },
  "aura-skin-laser": {
    brand: auraBrand,
    homepage: auraHomepage,
    treatments: auraTreatments,
    faq: auraFaq,
    testimonials: auraTestimonials,
    chat: auraChat,
    team: auraTeam,
    blogPosts: auraBlogPosts,
  },
  "bright-smile-dental": {
    brand: brightBrand,
    homepage: brightHomepage,
    treatments: brightTreatments,
    faq: brightFaq,
    testimonials: brightTestimonials,
    chat: brightChat,
    team: brightTeam,
    blogPosts: brightBlogPosts,
  },
  "glo-de-vie": {
    brand: gloBrand,
    homepage: gloHomepage,
    treatments: gloTreatments,
    faq: gloFaq,
    testimonials: gloTestimonials,
    chat: gloChat,
    team: gloTeam,
    blogPosts: gloBlogPosts,
  },
} as const;

const data = bundles[cid];

export const brandConfig = data.brand as BrandConfig;
export const homepageConfig = data.homepage as HomepageConfig;
export const treatmentsConfig = data.treatments as TreatmentsConfig;
export const faqConfig = data.faq as FaqData;
export const testimonialsConfig = data.testimonials as TestimonialsData;
export const chatConfig = data.chat as ChatConfig;
export const teamConfig = data.team;
export const blogPosts = data.blogPosts;

/** Primary booking destination for UI and assistant guidance (internal path or external URL). */
export const bookingHref = brandConfig.brand.ctas.book.href;

export function getFeaturedTreatments(): Treatment[] {
  const ids = homepageConfig.sections.featuredTreatments.featuredIds;
  const byId = new Map<string, Treatment>(
    treatmentsConfig.items.map((t) => [t.id, t]),
  );
  return ids
    .map((id) => byId.get(id))
    .filter((t): t is Treatment => Boolean(t));
}

export function getFeaturedFaqItems(): FaqItem[] {
  const ids = homepageConfig.sections.faq.featuredIds;
  const byId = new Map<string, FaqItem>(faqConfig.items.map((f) => [f.id, f]));
  return ids.map((id) => byId.get(id)).filter((f): f is FaqItem => Boolean(f));
}

export function getFeaturedTestimonials(): Testimonial[] {
  const ids = homepageConfig.sections.testimonials.featuredIds;
  const byId = new Map<string, Testimonial>(
    testimonialsConfig.items.map((t) => [t.id, t]),
  );
  return ids
    .map((id) => byId.get(id))
    .filter((t): t is Testimonial => Boolean(t));
}
