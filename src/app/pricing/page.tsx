import type { Metadata } from "next";
import PricingCard from "@/components/marketing/PricingCard";
import { plans } from "@/components/marketing/PricingPreview";

export const metadata: Metadata = {
  title: "Pricing — Starter, Growth & Scale Packages",
  description: "Transparent monthly pricing for MarketFlow's digital marketing packages.",
};

const faqs = [
  { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade at the start of any billing cycle." },
  { q: "Is there a contract?", a: "Plans are month-to-month. We ask for a 3-month minimum to let strategy compound." },
  { q: "Does pricing include ad spend?", a: "No — ad spend (Google/Meta) is paid directly to the platform, separate from our management fee." },
  { q: "What if I need something custom?", a: "Contact us — we build custom packages for larger or multi-brand accounts." },
];

export default function PricingPage() {
  return (
    <div className="section-y">
      <div className="container-xl">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 max-w-xl text-mist-100/70">
          Every plan includes strategy, execution and reporting. Choose the one that matches your stage.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="mt-24 max-w-2xl">
          <h2 className="font-display text-2xl font-bold">Pricing FAQ</h2>
          <div className="mt-6 flex flex-col divide-y divide-white/10">
            {faqs.map((f) => (
              <details key={f.q} className="py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-mist-50">{f.q}</summary>
                <p className="mt-2 text-sm text-mist-100/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
