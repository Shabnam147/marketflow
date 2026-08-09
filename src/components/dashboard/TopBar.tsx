"use client";
import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar({ title }: { title: string }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : { unreadCount: 0 }))
      .then((d) => setUnread(d.unreadCount || 0))
      .catch(() => {});
  }, []);

  return (
    <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 lg:px-10">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" aria-label="Menu"><Menu size={20} /></button>
        <h1 className="font-display text-xl font-bold">{title}</h1>
      </div>
      <button className="relative rounded-full border border-white/10 p-2" aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px]">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
