import type { LucideIcon } from "lucide-react";

export default function DashboardCard({
  label, value, icon: Icon, trend,
}: { label: string; value: string; icon: LucideIcon; trend?: string }) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/10 text-electric-400">
          <Icon size={18} />
        </span>
        {trend && <span className="text-xs font-medium text-emerald-400">{trend}</span>}
      </div>
      <div className="mt-4 font-display text-2xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-mist-100/60">{label}</div>
    </div>
  );
}
