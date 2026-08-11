"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import ChatWindow from "@/components/dashboard/ChatWindow";
import Skeleton from "@/components/ui/Skeleton";

export default function MessagesPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [support, setSupport] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
    fetch("/api/support-contact")
      .then((r) => r.json())
      .then((d) => (d.id ? setSupport(d) : setError(d.error || "No support account configured yet.")))
      .catch(() => setError("Could not load support contact."));
  }, []);

  return (
    <div>
      <TopBar title="Messages" />
      <div className="p-6 lg:p-10">
        <p className="mb-4 text-sm text-mist-100/60">Chat directly with your MarketFlow account team.</p>
        {error && <p className="text-sm text-yellow-300">{error}</p>}
        {!error && (!user || !support) ? (
          <Skeleton className="h-[600px]" />
        ) : (
          user && support && <ChatWindow currentUserId={user.id} otherUserId={support.id} otherUserName={support.name} />
        )}
      </div>
    </div>
  );
}
