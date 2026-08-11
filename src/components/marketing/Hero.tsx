import Button from "@/components/ui/Button";
import GrowthCurve from "./GrowthCurve";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-xl grid items-center gap-16 py-24 lg:grid-cols-2 lg:py-32">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-mist-100/80">
            <Sparkles size={14} className="text-electric-400" /> Full-funnel digital marketing
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your Digital <span className="gradient-text">Growth Partner.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-mist-100/70">
            We help ambitious businesses attract customers, build powerful brands and turn digital
            traffic into measurable revenue.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" size="lg">
              Get Free Consultation <ArrowUpRight size={16} />
            </Button>
            <Button href="/services" size="lg" variant="outline">
              View Our Services
            </Button>
          </div>
        </div>
        <GrowthCurve />
      </div>
    </section>
  );
}
