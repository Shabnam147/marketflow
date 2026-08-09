import type { Metadata } from "next";
import Link from "next/link";
import { Search, Link2, Calculator, TrendingUp, DollarSign, Type, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Free Marketing Tools" };

const tools = [
  { icon: Search, name: "Website SEO Checker", href: "/tools/seo-checker", desc: "Run a free automated scan of your homepage." },
  { icon: Link2, name: "UTM Generator", href: "/tools/utm-generator", desc: "Build trackable campaign links in seconds." },
  { icon: TrendingUp, name: "Marketing ROI Calculator", href: "/tools/roi-calculator", desc: "See the return on your marketing spend." },
  { icon: Calculator, name: "Social Media Engagement Calculator", href: "/tools/roi-calculator", desc: "Coming soon." },
  { icon: DollarSign, name: "Ad Budget Calculator", href: "/tools/roi-calculator", desc: "Coming soon." },
  { icon: Type, name: "Meta Title Generator", href: "/tools/seo-checker", desc: "Coming soon." },
  { icon: FileText, name: "Meta Description Generator", href: "/tools/seo-checker", desc: "Coming soon." },
];

export default function ToolsPage() {
  return (
    <div className="section-y">
      <div className="container-xl">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Free Marketing Tools</h1>
        <p className="mt-4 max-w-xl text-mist-100/70">Quick, practical tools — no signup required.</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.name} href={t.href} className="card-surface flex flex-col gap-3 p-6 hover:border-electric-400/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/10 text-electric-400">
                <t.icon size={20} />
              </span>
              <span className="font-medium">{t.name}</span>
              <span className="text-xs text-mist-100/50">{t.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
