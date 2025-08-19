import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import CTA from "@/components/landing/cta";
import InteractiveShowcase from "@/components/ui/interactive-showcase";
export default function Landing() {
  return (
    <>
      <div className="overflow-hidden ">
        <Hero />
        <InteractiveShowcase />
      </div>
      <Features />

      <CTA />
    </>
  );
}
