import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services — SEO, Ads, Social & More",
  description: "Explore MarketFlow's full range of digital marketing services, pricing, and what's included.",
};

const services = [
  {
    id: "social",
    name: "Social Media Marketing",
    description:
      "We plan, create and manage your social presence so it consistently builds audience and drives traffic.",
    features: ["Instagram management", "Facebook management", "Content calendar", "Reels", "Posts", "Stories", "Hashtag research", "Analytics"],
    benefits: ["Consistent brand presence", "More engaged followers", "Content that converts to leads"],
    deliverables: ["Monthly content calendar", "Scheduled posts & reels", "Monthly performance report"],
    startingPrice: "$399/mo",
    faqs: [
      { q: "Which platforms do you manage?", a: "Instagram and Facebook are standard; TikTok and LinkedIn can be added." },
      { q: "Do you create the content?", a: "Yes — copy, graphics and short-form video are included in every plan." },
    ],
  },
  {
    id: "seo",
    name: "SEO",
    description: "We improve your organic visibility so the right customers find you without paying for every click.",
    features: ["Keyword research", "On-page SEO", "Technical SEO", "Local SEO", "Link building", "Monthly reports"],
    benefits: ["Long-term, compounding traffic", "Lower cost-per-lead over time", "Higher search trust"],
    deliverables: ["SEO audit", "On-page optimizations", "Monthly ranking report"],
    startingPrice: "$599/mo",
    faqs: [
      { q: "How long until we see results?", a: "Most clients see meaningful movement within 3-6 months." },
      { q: "Do you guarantee rankings?", a: "No ethical SEO agency can guarantee specific rankings — we guarantee the work and report transparently." },
    ],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Search and display campaigns built to capture high-intent demand and turn clicks into revenue.",
    features: ["Search campaigns", "Display campaigns", "Keyword research", "Conversion tracking", "Campaign optimization"],
    benefits: ["Immediate visibility", "Precise budget control", "Measurable ROAS"],
    deliverables: ["Campaign build & launch", "Conversion tracking setup", "Bi-weekly optimization"],
    startingPrice: "$499/mo + ad spend",
    faqs: [
      { q: "What's the minimum ad spend?", a: "We recommend at least $1,000/mo in ad spend for meaningful data." },
    ],
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Facebook and Instagram advertising built for both discovery and retargeting.",
    features: ["Facebook Ads", "Instagram Ads", "Audience targeting", "Retargeting", "Creative testing"],
    benefits: ["Reach highly specific audiences", "Recover lost visitors with retargeting", "Continuous creative testing"],
    deliverables: ["Campaign structure & launch", "Weekly creative tests", "Performance dashboard"],
    startingPrice: "$499/mo + ad spend",
    faqs: [{ q: "Do you design the ad creatives?", a: "Yes, static and short-form video creatives are included." }],
  },
  {
    id: "content",
    name: "Content Marketing",
    description: "Blog, web copy and campaign content that builds authority and supports every other channel.",
    features: ["Blog writing", "Social content", "Website copy", "Marketing campaigns"],
    benefits: ["Builds long-term SEO value", "Strengthens brand voice", "Supports sales conversations"],
    deliverables: ["Editorial calendar", "Published articles", "On-brand campaign copy"],
    startingPrice: "$349/mo",
    faqs: [{ q: "Who writes the content?", a: "A dedicated content strategist works from your brand voice guide." }],
  },
  {
    id: "web-dev",
    name: "Website Development",
    description: "Fast, conversion-focused websites — from single landing pages to full e-commerce builds.",
    features: ["Landing pages", "Business websites", "E-commerce websites", "Conversion optimization"],
    benefits: ["Higher conversion rate", "Mobile-first performance", "Built to support your campaigns"],
    deliverables: ["Design mockups", "Development & QA", "Launch & analytics setup"],
    startingPrice: "From $1,499",
    faqs: [{ q: "How long does a website take?", a: "Landing pages: ~2 weeks. Full sites: 4-8 weeks depending on scope." }],
  },
  {
    id: "branding",
    name: "Branding",
    description: "Visual identity and messaging that make your business instantly recognizable.",
    features: ["Logo & identity", "Brand guidelines", "Messaging framework", "Marketing collateral"],
    benefits: ["Consistent presence everywhere", "Higher perceived trust", "Faster campaign production"],
    deliverables: ["Brand guideline document", "Logo files", "Core templates"],
    startingPrice: "From $999",
    faqs: [{ q: "Do you redesign existing brands?", a: "Yes, we offer both new identities and brand refreshes." }],
  },
  {
    id: "email",
    name: "Email Marketing",
    description: "Automated flows and campaigns that nurture leads and bring customers back.",
    features: ["Campaign creation", "Email automation", "Newsletter", "Lead nurturing"],
    benefits: ["Owned channel, no ad spend", "Higher repeat purchase rate", "Nurtures leads automatically"],
    deliverables: ["Automation flows", "Monthly campaigns", "Performance report"],
    startingPrice: "$299/mo",
    faqs: [{ q: "Which platforms do you use?", a: "We work with Klaviyo, Mailchimp and most major ESPs." }],
  },
];

export default function ServicesPage() {
  return (
    <div className="section-y">
      <div className="container-xl">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Our Services</h1>
        <p className="mt-4 max-w-2xl text-mist-100/70">
          Every service is designed to work together as one growth system — pick one to start, or combine them
          in a package.
        </p>

        <div className="mt-16 flex flex-col gap-24">
          {services.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-24 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">{s.name}</h2>
                <p className="mt-3 text-mist-100/70">{s.description}</p>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-mist-100/50">Includes</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-mist-100/80">
                          <Check size={15} className="mt-0.5 text-electric-400" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-mist-100/50">Benefits</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-mist-100/80">
                          <Check size={15} className="mt-0.5 text-violet-400" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-mist-100/50">FAQ</h3>
                  <div className="mt-3 flex flex-col divide-y divide-white/10">
                    {s.faqs.map((f) => (
                      <details key={f.q} className="group py-3">
                        <summary className="cursor-pointer list-none text-sm font-medium text-mist-50">{f.q}</summary>
                        <p className="mt-2 text-sm text-mist-100/60">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-surface h-fit p-8">
                <p className="text-sm text-mist-100/50">Deliverables</p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-mist-100/80">
                  {s.deliverables.map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-mist-100/50">Starting from</p>
                <p className="font-display text-3xl font-bold">{s.startingPrice}</p>
                <Button href="/signup" className="mt-6 w-full">
                  Request This Service
                </Button>
                <Link href="/contact" className="mt-3 block text-center text-xs text-mist-100/50 hover:text-white">
                  Have questions? Talk to us
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
