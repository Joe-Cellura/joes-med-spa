import PromoStrip from "../src/components/layout/PromoStrip";
import Navbar from "../src/components/layout/Navbar";
import HeroSection from "../src/components/sections/HeroSection";
import TrustBar from "../src/components/sections/TrustBar";
import FeaturedTreatments from "../src/components/sections/FeaturedTreatments";
import WhyChooseUsSection from "../src/components/sections/WhyChooseUsSection";
import TeamSection from "../src/components/sections/TeamSection";
import BeforeAfterGallery from "../src/components/sections/BeforeAfterGallery";
import TestimonialsSection from "../src/components/sections/TestimonialsSection";
import AboutSection from "../src/components/sections/AboutSection";
import FAQSection from "../src/components/sections/FAQSection";
import BlogPreviewSection from "../src/components/sections/BlogPreviewSection";
import FinalCTA from "../src/components/sections/FinalCTA";
import Footer from "../src/components/layout/Footer";
import ChatWidget from "../src/components/ai/ChatWidget";
import StickyMobileCTA from "../src/components/mobile/StickyMobileCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-0">
      <PromoStrip />
      <Navbar />
      <HeroSection />
      <TrustBar />
      <FeaturedTreatments />
      <WhyChooseUsSection />
      <TeamSection />
      <BeforeAfterGallery />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <BlogPreviewSection />
      <FinalCTA />
      <Footer />
      <ChatWidget />
      <StickyMobileCTA />
    </div>
  );
}

