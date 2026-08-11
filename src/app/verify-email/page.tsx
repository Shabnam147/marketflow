"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setStatus("error"); return; }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => setStatus(r.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [params]);

  return (
    <div className="section-y">
      <div className="container-xl flex justify-center text-center">
        <div className="max-w-md">
          {status === "loading" && <p className="text-mist-100/70">Verifying your email…</p>}
          {status === "success" && <h1 className="font-display text-2xl font-bold">Email verified! You can now sign in.</h1>}
          {status === "error" && <h1 className="font-display text-2xl font-bold text-red-300">That link is invalid or expired.</h1>}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
