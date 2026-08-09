import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-8",
        plan.highlighted ? "border-electric-400/50 bg-navy-800 shadow-glow" : "border-white/10 bg-navy-800/40"
      )}
    >
      {plan.highlighted && (
        <span className="mb-4 w-fit rounded-full bg-cta-gradient px-3 py-1 text-xs font-semibold">Most Popular</span>
      )}
      <h3 className="font-display text-xl font-bold">{plan.name}</h3>
      <p className="mt-1 text-sm text-mist-100/60">{plan.tagline}</p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold">{plan.price}</span>
        <span className="text-sm text-mist-100/50">/mo</span>
      </div>
      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-mist-100/80">
            <Check size={16} className="mt-0.5 shrink-0 text-electric-400" /> {f}
          </li>
        ))}
      </ul>
      <Button href="/signup" className="mt-8 w-full" variant={plan.highlighted ? "primary" : "outline"}>
        Get Started
      </Button>
    </div>
  );
}
