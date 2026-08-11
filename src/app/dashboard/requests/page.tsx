"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ServiceRequest {
  _id: string; businessName: string; service: { name: string }; status: string; createdAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null);

  useEffect(() => {
    fetch("/api/service-requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .catch(() => setRequests([]));
  }, []);

  return (
    <div>
      <TopBar title="Service Requests" />
      <div className="p-6 lg:p-10">
        {requests === null && <Skeleton className="h-48" />}
        {requests?.length === 0 && (
          <EmptyState
            icon={<ClipboardList size={32} />}
            title="No service requests yet"
            description="Request a service from any service page and track its status here."
            action={<Button href="/services" size="sm">Browse Services</Button>}
          />
        )}
        {requests && requests.length > 0 && (
          <div className="card-surface overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-mist-100/50">
                <tr>
                  <th className="px-6 py-4">Business</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td className="px-6 py-4">{r.businessName}</td>
                    <td className="px-6 py-4 text-mist-100/70">{r.service?.name}</td>
                    <td className="px-6 py-4 text-mist-100/50">{formatDate(r.createdAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
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
