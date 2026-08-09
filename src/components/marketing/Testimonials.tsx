import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Our lead volume roughly doubled within the first two quarters, and reporting made it easy to see why.",
    name: "Priya Menon",
    role: "Founder, Verdant Home",
  },
  {
    quote: "They treat our budget like it's their own money. That alone changed how we work with agencies.",
    name: "James Okafor",
    role: "CEO, Northline Fitness",
  },
  {
    quote: "The onboarding was fast and the strategy actually matched our stage of business, not a generic playbook.",
    name: "Ana Ruiz",
    role: "Marketing Lead, Cursive Studio",
  },
];

export default function Testimonials() {
  return (
    <section className="section-y">
      <div className="container-xl">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">What clients say</h2>
        <span className="mt-2 inline-block text-xs text-mist-100/40">Sample testimonials</span>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card-surface flex flex-col gap-4 p-8">
              <div className="flex gap-1 text-electric-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-mist-100/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto pt-2">
                <div className="text-sm font-semibold text-mist-50">{t.name}</div>
                <div className="text-xs text-mist-100/50">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
