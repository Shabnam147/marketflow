"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { Loader2 } from "lucide-react";

const GOAL_OPTIONS = [
  "Generate leads", "Increase sales", "Increase website traffic", "Grow social media", "Improve SEO", "Build brand awareness",
];
const SERVICE_OPTIONS = [
  "Social Media Marketing", "SEO", "Google Ads", "Meta Ads", "Content Marketing", "Website Development", "Email Marketing",
];
const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    companyDescription: "", website: "", industry: "", targetAudience: "",
    marketingGoals: [] as string[], monthlyBudget: "", selectedServices: [] as string[],
  });

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  async function finish() {
    setLoading(true);
    // In production this POSTs to a dedicated /api/onboarding route that
    // updates ClientProfile with onboardingCompleted: true.
    await new Promise((r) => setTimeout(r, 600));
    router.push("/dashboard");
  }

  return (
    <div className="section-y">
      <div className="container-xl flex justify-center">
        <div className="w-full max-w-xl">
          <p className="text-xs text-mist-100/50">Step {step} of {TOTAL_STEPS}</p>
          <div className="mt-2"><ProgressBar value={(step / TOTAL_STEPS) * 100} /></div>

          <div className="card-surface mt-8 p-8">
            {step === 1 && (
              <>
                <h2 className="font-display text-xl font-bold">Tell us about your business</h2>
                <div className="mt-6">
                  <label className="text-sm font-medium text-mist-100">Business description</label>
                  <textarea
                    rows={4}
                    value={data.companyDescription}
                    onChange={(e) => setData({ ...data, companyDescription: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="font-display text-xl font-bold">Your website</h2>
                <div className="mt-6">
                  <Input label="Website URL" value={data.website} onChange={(e) => setData({ ...data, website: e.target.value })} placeholder="https://yourbusiness.com" />
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="font-display text-xl font-bold">Your industry</h2>
                <div className="mt-6">
                  <Input label="Industry" value={data.industry} onChange={(e) => setData({ ...data, industry: e.target.value })} placeholder="e.g. Restaurant, E-commerce, SaaS" />
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="font-display text-xl font-bold">Who are you trying to reach?</h2>
                <div className="mt-6">
                  <textarea
                    rows={3}
                    value={data.targetAudience}
                    onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
                    placeholder="Describe your ideal customer"
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  />
                </div>
              </>
            )}
            {step === 5 && (
              <>
                <h2 className="font-display text-xl font-bold">What are your marketing goals?</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setData({ ...data, marketingGoals: toggle(data.marketingGoals, g) })}
                      className={`rounded-xl border px-4 py-3 text-left text-sm ${data.marketingGoals.includes(g) ? "border-electric-400 bg-electric-500/10" : "border-white/10"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 6 && (
              <>
                <h2 className="font-display text-xl font-bold">Monthly marketing budget</h2>
                <div className="mt-6">
                  <Input label="Budget (USD)" type="number" value={data.monthlyBudget} onChange={(e) => setData({ ...data, monthlyBudget: e.target.value })} />
                </div>
              </>
            )}
            {step === 7 && (
              <>
                <h2 className="font-display text-xl font-bold">Select services</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {SERVICE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setData({ ...data, selectedServices: toggle(data.selectedServices, s) })}
                      className={`rounded-xl border px-4 py-3 text-left text-sm ${data.selectedServices.includes(s) ? "border-electric-400 bg-electric-500/10" : "border-white/10"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</Button>
              {step < TOTAL_STEPS ? (
                <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
              ) : (
                <Button onClick={finish} disabled={loading}>
                  {loading && <Loader2 size={16} className="animate-spin" />} Finish
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
