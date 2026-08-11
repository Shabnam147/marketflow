"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { Layers } from "lucide-react";

interface Service { _id: string; name: string; category: string; startingPrice: number; isActive: boolean; }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services || [])).catch(() => setServices([]));
  }, []);

  return (
    <div>
      <TopBar title="Services" />
      <div className="p-6 lg:p-10">
        {services === null && <Skeleton className="h-48" />}
        {services?.length === 0 && (
          <EmptyState icon={<Layers size={32} />} title="No services in the catalog yet" description="Seed the Service model or add one via the admin API to manage pricing here." />
        )}
        {services && services.length > 0 && (
          <div className="card-surface overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-mist-100/50">
                <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Starting Price</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map((s) => (
                  <tr key={s._id}>
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4 text-mist-100/70">{s.category}</td>
                    <td className="px-6 py-4 text-mist-100/70">${s.startingPrice}</td>
                    <td className="px-6 py-4"><StatusBadge status={s.isActive ? "Approved" : "Pending"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
