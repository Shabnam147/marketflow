"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Free Tools" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-950/80 backdrop-blur-md">
      <div className="container-xl flex h-18 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-gradient text-sm">M</span>
          MarketFlow
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-mist-100/80 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-sm font-medium text-mist-100/80 hover:text-white">
            Sign In
          </Link>
          <Button href="/contact" size="sm">
            Book a Free Call <ArrowUpRight size={14} />
          </Button>
        </div>

        <button
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 px-6 pb-6 lg:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-mist-100/80">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium">
                Sign In
              </Link>
              <Button href="/contact" size="sm">
                Book a Free Call
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
