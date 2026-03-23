import brandData from "../data/clients/aura-skin-laser/brand.json";
import homepageData from "../data/clients/aura-skin-laser/homepage.json";
import treatmentsData from "../data/clients/aura-skin-laser/treatments.json";
import faqData from "../data/clients/aura-skin-laser/faq.json";
import testimonialsData from "../data/clients/aura-skin-laser/testimonials.json";
import chatData from "../data/clients/aura-skin-laser/chat.json";
import teamData from "../data/clients/aura-skin-laser/team.json";
import { blogPosts as blogPostsData } from "../data/clients/aura-skin-laser/blogPosts";
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
export const teamConfig = teamData;
export const blogPosts = blogPostsData;

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
