"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Copy } from "lucide-react";

export default function UtmGeneratorPage() {
  const [form, setForm] = useState({ url: "", source: "", medium: "", campaign: "", term: "", content: "" });
  const [copied, setCopied] = useState(false);

  const result = (() => {
    if (!form.url) return "";
    try {
      const u = new URL(form.url);
      const params = new URLSearchParams();
      if (form.source) params.set("utm_source", form.source);
      if (form.medium) params.set("utm_medium", form.medium);
      if (form.campaign) params.set("utm_campaign", form.campaign);
      if (form.term) params.set("utm_term", form.term);
      if (form.content) params.set("utm_content", form.content);
      u.search = params.toString();
      return u.toString();
    } catch {
      return "Enter a valid URL (include https://)";
    }
  })();

  return (
    <div className="section-y">
      <div className="container-xl max-w-2xl">
        <h1 className="font-display text-4xl font-bold">UTM Generator</h1>
        <p className="mt-4 text-mist-100/70">Build trackable campaign links for your marketing channels.</p>

        <div className="card-surface mt-8 flex flex-col gap-4 p-6">
          <Input label="Website URL" placeholder="https://yourbusiness.com" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Source (utm_source)" placeholder="newsletter" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <Input label="Medium (utm_medium)" placeholder="email" value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} />
          </div>
          <Input label="Campaign (utm_campaign)" placeholder="summer_sale" value={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Term (optional)" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
            <Input label="Content (optional)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
        </div>

        {result && (
          <div className="card-surface mt-6 flex items-center justify-between gap-4 p-4">
            <code className="break-all text-sm text-electric-400">{result}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            >
              <Copy size={14} /> {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-white/10 p-6 text-center">
          <p className="text-sm text-mist-100/70">Want a professional marketing strategy?</p>
          <Button href="/contact" className="mt-3">Book a Free Consultation</Button>
        </div>
      </div>
    </div>
  );
}
