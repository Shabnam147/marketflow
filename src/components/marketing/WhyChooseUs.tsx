import { LineChart, Eye, HeadphonesIcon, Sliders, Target, TrendingUp } from "lucide-react";

const points = [
  { icon: LineChart, title: "Data-driven strategy", desc: "Every decision is backed by numbers, not guesswork." },
  { icon: Eye, title: "Transparent reporting", desc: "See exactly where your budget goes and what it returns." },
  { icon: HeadphonesIcon, title: "Dedicated support", desc: "A real team you can reach, not a ticket queue." },
  { icon: Sliders, title: "Customized campaigns", desc: "Built around your business, not a template." },
  { icon: Target, title: "Performance tracking", desc: "Live dashboards so you always know what's working." },
  { icon: TrendingUp, title: "ROI-focused marketing", desc: "We optimize for revenue, not vanity metrics." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-y bg-navy-900/40">
      <div className="container-xl">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Why businesses choose MarketFlow</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cta-gradient/20 text-electric-400">
                <Icon size={20} />
              </span>
              <div>
                <h3 className="font-display font-semibold text-mist-50">{title}</h3>
                <p className="mt-1 text-sm text-mist-100/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
