import type { Metadata } from "next";

export const metadata: Metadata = { title: "Case Studies" };

const cases = [
  {
    client: "Verdant Home",
    industry: "E-commerce / Home Goods",
    problem: "Flat organic traffic and reliance on expensive paid ads.",
    strategy: "Technical SEO overhaul, content hub, and email win-back flows.",
    services: ["SEO", "Content Marketing", "Email Marketing"],
    before: { traffic: "4,200/mo", conversion: "1.2%" },
    after: { traffic: "11,900/mo", conversion: "2.6%" },
    timeline: "6 months",
  },
  {
    client: "Northline Fitness",
    industry: "Local Services",
    problem: "Low visibility against national gym chains in local search.",
    strategy: "Local SEO, Google Business optimization, and geo-targeted Meta Ads.",
    services: ["Local SEO", "Meta Ads"],
    before: { leads: "18/mo", cpl: "$62" },
    after: { leads: "54/mo", cpl: "$24" },
    timeline: "4 months",
  },
  {
    client: "Cursive Studio",
    industry: "Coaching / Personal Brand",
    problem: "Strong Instagram following that wasn't converting to paying clients.",
    strategy: "Funnel redesign, email nurture sequence, and paid retargeting.",
    services: ["Website Development", "Email Marketing", "Meta Ads"],
    before: { conversion: "0.8%" },
    after: { conversion: "3.1%" },
    timeline: "3 months",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="section-y">
      <div className="container-xl">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Case Studies</h1>
        <span className="mt-2 inline-block text-xs text-mist-100/40">Sample / demo case studies — real client results will replace these</span>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {cases.map((c) => (
            <div key={c.client} className="card-surface flex flex-col gap-4 p-8">
              <div>
                <h3 className="font-display text-xl font-bold">{c.client}</h3>
                <p className="text-xs text-mist-100/50">{c.industry} · {c.timeline}</p>
              </div>
              <p className="text-sm text-mist-100/70"><span className="font-medium text-mist-50">Problem: </span>{c.problem}</p>
              <p className="text-sm text-mist-100/70"><span className="font-medium text-mist-50">Strategy: </span>{c.strategy}</p>
              <div className="flex flex-wrap gap-2">
                {c.services.map((s) => (
                  <span key={s} className="rounded-full bg-electric-500/10 px-3 py-1 text-xs text-electric-400">{s}</span>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
                <div>
                  <p className="text-xs text-mist-100/50">Before</p>
                  {Object.entries(c.before).map(([k, v]) => <p key={k}>{v} <span className="text-mist-100/40">{k}</span></p>)}
                </div>
                <div>
                  <p className="text-xs text-mist-100/50">After</p>
                  {Object.entries(c.after).map(([k, v]) => <p key={k} className="text-electric-400">{v} <span className="text-mist-100/40">{k}</span></p>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
