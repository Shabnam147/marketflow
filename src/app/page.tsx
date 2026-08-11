import Hero from "@/components/marketing/Hero";
import TrustedBy from "@/components/marketing/TrustedBy";
import ServicesOverview from "@/components/marketing/ServicesOverview";
import WhyChooseUs from "@/components/marketing/WhyChooseUs";
import Process from "@/components/marketing/Process";
import Results from "@/components/marketing/Results";
import Testimonials from "@/components/marketing/Testimonials";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";
import StickyMobileCTA from "@/components/marketing/StickyMobileCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ServicesOverview />
      <WhyChooseUs />
      <Process />
      <Results />
      <Testimonials />
      <PricingPreview />
      <CTASection />
      <StickyMobileCTA />
    </>
  );
}
