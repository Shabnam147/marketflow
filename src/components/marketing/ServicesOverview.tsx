import Link from "next/link";
import {
  Share2, Search, MousePointerClick, Instagram, PenTool, Globe, Palette, Mail, MapPin, BarChart3,
} from "lucide-react";

const services = [
  { icon: Share2, name: "Social Media Marketing", href: "/services#social" },
  { icon: Search, name: "SEO", href: "/services#seo" },
  { icon: MousePointerClick, name: "Google Ads", href: "/services#google-ads" },
  { icon: Instagram, name: "Meta Ads", href: "/services#meta-ads" },
  { icon: PenTool, name: "Content Marketing", href: "/services#content" },
  { icon: Globe, name: "Website Development", href: "/services#web-dev" },
  { icon: Palette, name: "Branding", href: "/services#branding" },
  { icon: Mail, name: "Email Marketing", href: "/services#email" },
  { icon: MapPin, name: "Local SEO", href: "/services#local-seo" },
  { icon: BarChart3, name: "Analytics & Reporting", href: "/services#analytics" },
];

export default function ServicesOverview() {
  return (
    <section className="section-y">
      <div className="container-xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need to grow, in one place</h2>
          <p className="mt-4 text-mist-100/70">
            From visibility to conversion, our services work together as one connected growth engine.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {services.map(({ icon: Icon, name, href }) => (
            <Link
              key={name}
              href={href}
              className="card-surface group flex flex-col gap-4 p-6 transition-colors hover:border-electric-400/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/10 text-electric-400">
                <Icon size={20} />
              </span>
              <span className="font-medium text-mist-50">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
