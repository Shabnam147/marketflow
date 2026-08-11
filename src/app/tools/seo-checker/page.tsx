"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface AuditResult {
  scores: { seo: number; performance: number; technicalSeo: number; content: number };
  recommendations: string[];
  pageTitle?: string;
  metaDescription?: string;
}

export default function SeoCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  async function runAudit() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not audit that URL.");
      setResult(data.audit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-y">
      <div className="container-xl max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Free Website SEO Checker</h1>
        <p className="mt-4 text-mist-100/70">
          Enter your homepage URL for a quick automated check. This is a basic scan, not a complete professional audit.
        </p>

        <div className="card-surface mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="Website URL" placeholder="https://yourbusiness.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <Button onClick={runAudit} disabled={loading || !url}>
            {loading && <Loader2 size={16} className="animate-spin" />} Run Free Audit
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {result && (
          <div className="mt-10">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(result.scores).map(([key, value]) => (
                <div key={key} className="card-surface p-5 text-center">
                  <div className="font-display text-3xl font-bold gradient-text">{value}</div>
                  <div className="mt-1 text-xs capitalize text-mist-100/60">{key.replace(/([A-Z])/g, " $1")}</div>
                </div>
              ))}
            </div>

            <div className="card-surface mt-6 p-6">
              <h3 className="font-display font-semibold">Recommendations</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {result.recommendations.length === 0 && (
                  <li className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={16} /> No major issues found in this basic scan.</li>
                )}
                {result.recommendations.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-mist-100/80">
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-yellow-400" /> {r}
                  </li>
                ))}
              </ul>
              <Button href="/contact" className="mt-6 w-full">Want us to fix these issues? Book a Free Consultation</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
