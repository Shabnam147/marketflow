"use client";
import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; message: string; variant: "success" | "error" };
type ToastContextType = { push: (message: string, variant?: "success" | "error") => void };

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(message: string, variant: "success" | "error" = "success") {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((toast) => toast.id !== id)), 4000);
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-glow backdrop-blur-md",
              t.variant === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            )}
          >
            {t.variant === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {t.message}
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
