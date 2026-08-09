import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  Reviewed: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  "Proposal Sent": "bg-violet-500/10 text-violet-300 border-violet-500/30",
  Approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  "In Progress": "bg-electric-500/10 text-electric-400 border-electric-500/30",
  Completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Paid: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Overdue: "bg-red-500/10 text-red-300 border-red-500/30",
  New: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  Contacted: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  Qualified: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  Won: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Lost: "bg-red-500/10 text-red-300 border-red-500/30",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        statusStyles[status] || "bg-white/5 text-mist-100 border-white/10"
      )}
    >
      {status}
    </span>
  );
}
