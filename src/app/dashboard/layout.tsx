import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-navy-950">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
