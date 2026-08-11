"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const;

interface Lead {
  _id: string; name: string; email: string; company?: string; status: string; estimatedValue?: number; source: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  async function load() {
    const res = await fetch("/api/leads");
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
    } else {
      setLeads([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function moveLead(leadId: string, status: string) {
    setLeads((prev) => prev?.map((l) => (l._id === leadId ? { ...l, status } : l)) || null);
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, status }),
    });
  }

  return (
    <div>
      <TopBar title="Leads" />
      <div className="overflow-x-auto p-6 lg:p-10">
        {leads === null && <Skeleton className="h-96" />}
        {leads && (
          <div className="grid min-w-[1000px] grid-cols-6 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{status}</h3>
                  <span className="text-xs text-mist-100/40">{leads.filter((l) => l.status === status).length}</span>
                </div>
                <div className="flex min-h-[200px] flex-col gap-3 rounded-xl bg-navy-900/40 p-2">
                  {leads.filter((l) => l.status === status).map((lead) => (
                    <div key={lead._id} className="card-surface p-4">
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-mist-100/50">{lead.company || lead.email}</p>
                      {lead.estimatedValue && <p className="mt-1 text-xs text-electric-400">${lead.estimatedValue}</p>}
                      <p className="mt-1 text-[10px] text-mist-100/30">{lead.source}</p>
                      <select
                        value={lead.status}
                        onChange={(e) => moveLead(lead._id, e.target.value)}
                        className={cn(
                          "mt-3 w-full rounded-lg border border-white/10 bg-navy-950 px-2 py-1.5 text-xs"
                        )}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
