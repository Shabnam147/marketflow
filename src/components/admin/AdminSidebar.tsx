"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, KanbanSquare, FolderKanban, CalendarClock, CreditCard, Layers, Newspaper, LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: KanbanSquare },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-navy-900/60 p-6 lg:flex">
      <Link href="/" className="mb-10 flex items-center gap-2 font-display text-lg font-bold">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta-gradient text-xs">M</span>
        MarketFlow <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal">Admin</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-electric-500/10 text-electric-400" : "text-mist-100/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <l.icon size={18} /> {l.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mist-100/60 hover:bg-white/5 hover:text-white">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
