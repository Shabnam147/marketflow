import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with MarketFlow. Our team responds within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="section-y">
      <div className="container-xl grid gap-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Let&apos;s talk growth.</h1>
          <p className="mt-4 max-w-md text-mist-100/70">
            Tell us about your business and goals. A strategist will respond within 24 hours with next steps.
          </p>
          <div className="mt-10 flex flex-col gap-5">
            <div className="flex items-center gap-3 text-sm text-mist-100/70">
              <Phone size={18} className="text-electric-400" /> +1 (000) 000-0000
            </div>
            <div className="flex items-center gap-3 text-sm text-mist-100/70">
              <Mail size={18} className="text-electric-400" /> hello@marketflow.agency
            </div>
            <div className="flex items-center gap-3 text-sm text-mist-100/70">
              <MapPin size={18} className="text-electric-400" /> Mumbai, India — working with clients worldwide
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
