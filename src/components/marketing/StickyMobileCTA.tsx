import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-4 bottom-4 z-30 flex gap-3 lg:hidden">
      <Link
        href="tel:+10000000000"
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-800 py-3 text-sm font-semibold shadow-glow border border-white/10"
      >
        <Phone size={16} /> Call
      </Link>
      <Link
        href="https://wa.me/10000000000"
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cta-gradient py-3 text-sm font-semibold shadow-glow"
      >
        <MessageCircle size={16} /> WhatsApp
      </Link>
    </div>
  );
}
