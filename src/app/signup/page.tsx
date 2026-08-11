"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", companyName: "", password: "", confirmPassword: "", agreedToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.agreedToTerms) {
      setError("Please agree to the Terms & Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not create account.");
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-y">
      <div className="container-xl flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-mist-100/60">Start your growth plan in a few minutes.</p>

          <form onSubmit={handleSubmit} className="card-surface mt-8 flex flex-col gap-4 p-8">
            <Input label="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input label="Confirm Password" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

            <label className="flex items-start gap-2 text-xs text-mist-100/60">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.agreedToTerms}
                onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
              />
              I agree to the <Link href="/terms" className="underline">Terms</Link> &amp; <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </Button>

            <p className="text-center text-sm text-mist-100/60">
              Already have an account? <Link href="/login" className="text-electric-400">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
