import Link from "next/link";
import { Instagram, Linkedin, Twitter, Facebook } from "lucide-react";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services#seo", label: "SEO" },
      { href: "/services#social", label: "Social Media Marketing" },
      { href: "/services#google-ads", label: "Google Ads" },
      { href: "/services#meta-ads", label: "Meta Ads" },
      { href: "/services#web-dev", label: "Website Development" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/case-studies", label: "Case Studies" },
      { href: "/blog", label: "Blog" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/tools", label: "Free Marketing Tools" },
      { href: "/tools/seo-checker", label: "Website SEO Checker" },
      { href: "/contact", label: "Book a Consultation" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="container-xl grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-gradient text-sm">M</span>
            MarketFlow
          </Link>
          <p className="mt-4 max-w-xs text-sm text-mist-100/60">
            Turn attention into growth. We help small businesses, startups and e-commerce brands win with
            data-driven digital marketing.
          </p>
          <div className="mt-6 flex gap-4 text-mist-100/60">
            <Instagram size={18} />
            <Linkedin size={18} />
            <Twitter size={18} />
            <Facebook size={18} />
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-mist-50">{col.title}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-mist-100/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="container-xl flex flex-col items-center justify-between gap-4 text-xs text-mist-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} MarketFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
