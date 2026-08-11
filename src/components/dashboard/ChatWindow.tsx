"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  _id: string; sender: string; recipient: string; body: string; createdAt: string; readAt?: string;
}

export default function ChatWindow({ currentUserId, otherUserId, otherUserName }: {
  currentUserId: string; otherUserId: string; otherUserName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {
    const res = await fetch(`/api/messages?with=${otherUserId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
    // In production: connect to the Socket.IO server here and listen for
    // "message:new" events scoped to this conversationId for live updates,
    // instead of (or in addition to) this poll.
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!draft.trim()) return;
    const body = draft;
    setDraft("");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: otherUserId, body }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    }
  }

  return (
    <div className="card-surface flex h-[600px] flex-col">
      <div className="border-b border-white/10 p-4">
        <p className="font-medium">{otherUserName}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && <p className="text-sm text-mist-100/50">Loading conversation…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-mist-100/50">No messages yet. Say hello!</p>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m) => {
            const mine = m.sender === currentUserId;
            return (
              <div key={m._id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                  mine ? "bg-cta-gradient text-white" : "bg-white/5 text-mist-100"
                )}>
                  <p>{m.body}</p>
                  <p className={cn("mt-1 text-[10px]", mine ? "text-white/70" : "text-mist-100/40")}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {mine && (m.readAt ? " · Read" : " · Sent")}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 p-4">
        <button className="text-mist-100/50 hover:text-white" aria-label="Attach file"><Paperclip size={18} /></button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-white/10 bg-navy-900/60 px-4 py-2.5 text-sm focus:border-electric-400 focus:outline-none"
        />
        <button onClick={sendMessage} className="flex h-9 w-9 items-center justify-center rounded-full bg-cta-gradient" aria-label="Send message">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
