import PricingCard, { type PricingPlan } from "./PricingCard";

export const plans: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "For small businesses getting started",
    price: "$499",
    features: ["Social media management", "8 posts / month", "Basic SEO", "Monthly report", "Email support"],
  },
  {
    name: "Growth",
    tagline: "For businesses ready to scale",
    price: "$1,299",
    highlighted: true,
    features: [
      "Social media management",
      "16 posts / month",
      "SEO",
      "Google Ads management",
      "Meta Ads management",
      "Bi-weekly reports",
      "Strategy calls",
    ],
  },
  {
    name: "Scale",
    tagline: "For established businesses",
    price: "$2,999",
    features: [
      "Full digital marketing",
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Content marketing",
      "Email marketing",
      "Advanced analytics",
      "Dedicated account manager",
    ],
  },
];

export default function PricingPreview() {
  return (
    <section className="section-y bg-navy-900/40">
      <div className="container-xl">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-mist-100/70">Pick a package to start. Every plan scales with you.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
