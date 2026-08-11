"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid email or password.");
      const redirect = params.get("redirect");
      router.push(redirect || (data.user.role === "admin" ? "/admin" : "/dashboard"));
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
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-mist-100/60">Sign in to your MarketFlow dashboard.</p>

          <form onSubmit={handleSubmit} className="card-surface mt-8 flex flex-col gap-4 p-8">
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

            <div className="flex items-center justify-between text-xs text-mist-100/60">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-electric-400">Forgot password?</Link>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </Button>

            <Button type="button" variant="outline" className="w-full" onClick={() => alert("Configure GOOGLE_CLIENT_ID/SECRET to enable Google sign-in.")}>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-mist-100/60">
              Don&apos;t have an account? <Link href="/signup" className="text-electric-400">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
