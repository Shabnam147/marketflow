"use client";
import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true); // Always show success to avoid leaking which emails exist.
  }

  return (
    <div className="section-y">
      <div className="container-xl flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold">Reset your password</h1>
          {sent ? (
            <p className="mt-6 text-sm text-mist-100/70">
              If an account exists for {email}, a reset link has been sent.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="card-surface mt-8 flex flex-col gap-4 p-8">
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit">Send Reset Link</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
