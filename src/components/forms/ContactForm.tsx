"use client";
import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

const initialState = {
  name: "", email: "", phone: "", company: "", website: "", serviceRequired: "", budget: "", message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Something went wrong. Please try again.");
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="card-surface p-8 text-center">
        <h3 className="font-display text-xl font-semibold">Thanks! Our team will contact you within 24 hours.</h3>
        <p className="mt-2 text-sm text-mist-100/60">We&apos;ve saved your details and a specialist will follow up shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface flex flex-col gap-4 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <Input label="Service required" value={form.serviceRequired} onChange={(e) => setForm({ ...form, serviceRequired: e.target.value })} />
      </div>
      <Input label="Monthly budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-mist-100">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-mist-50 placeholder:text-mist-100/30 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
        />
      </div>
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      <Button type="submit" disabled={status === "submitting"} className="mt-2">
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        Send Message
      </Button>
    </form>
  );
}
