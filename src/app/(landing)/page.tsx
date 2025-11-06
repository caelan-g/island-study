import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import CTA from "@/components/landing/cta";
import Proof from "@/components/landing/proof";
import InteractiveShowcase from "@/components/ui/interactive-showcase";
export default function Landing() {
  return (
    <>
      <div className="overflow-hidden ">
        <Hero />
        <div className="bg-white">
          <div id="features" />
          <InteractiveShowcase />
          <Proof />
        </div>
      </div>
      <div id="info" />
      <Features />
      <CTA />
    </>
  );
}
