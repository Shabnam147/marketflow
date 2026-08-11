import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-navy-950">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
