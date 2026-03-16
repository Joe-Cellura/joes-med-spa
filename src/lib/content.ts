import brandData from "../data/brand.json";
import homepageData from "../data/homepage.json";
import treatmentsData from "../data/treatments.json";
import faqData from "../data/faq.json";
import testimonialsData from "../data/testimonials.json";
import chatData from "../data/chat.json";
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

export const brandConfig = brandData as BrandConfig;
export const homepageConfig = homepageData as HomepageConfig;
export const treatmentsConfig = treatmentsData as TreatmentsConfig;
export const faqConfig = faqData as FaqData;
export const testimonialsConfig = testimonialsData as TestimonialsData;
export const chatConfig = chatData as ChatConfig;

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

