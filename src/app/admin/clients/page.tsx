"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Client {
  _id: string; fullName: string; email: string; companyName?: string; isDisabled: boolean; createdAt: string;
  profile?: { onboardingCompleted: boolean; industry?: string };
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[] | null>(null);

  async function load() {
    const res = await fetch("/api/admin/clients");
    const data = await res.json();
    setClients(res.ok ? data.clients : []);
  }

  useEffect(() => { load(); }, []);

  async function toggleDisabled(userId: string, isDisabled: boolean) {
    setClients((prev) => prev?.map((c) => (c._id === userId ? { ...c, isDisabled } : c)) || null);
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isDisabled }),
    });
  }

  return (
    <div>
      <TopBar title="Clients" />
      <div className="p-6 lg:p-10">
        {clients === null && <Skeleton className="h-64" />}
        {clients?.length === 0 && <EmptyState icon={<Users size={32} />} title="No clients yet" description="Run npm run seed for demo clients, or wait for real signups." />}
        {clients && clients.length > 0 && (
          <div className="card-surface overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-mist-100/50">
                <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Company</th><th className="px-6 py-4">Joined</th><th className="px-6 py-4">Status</th><th className="px-6 py-4"></th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map((c) => (
                  <tr key={c._id}>
                    <td className="px-6 py-4">{c.fullName}<br /><span className="text-xs text-mist-100/40">{c.email}</span></td>
                    <td className="px-6 py-4 text-mist-100/70">{c.companyName || "—"}</td>
                    <td className="px-6 py-4 text-mist-100/50">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={c.isDisabled ? "text-red-300" : "text-emerald-300"}>{c.isDisabled ? "Disabled" : "Active"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline" onClick={() => toggleDisabled(c._id, !c.isDisabled)}>
                        {c.isDisabled ? "Enable" : "Disable"}
                      </Button>
                    </td>
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
