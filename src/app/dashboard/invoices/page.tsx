"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { FileText, Download, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
  _id: string; invoiceNumber: string; service: string; total: number; currency: string; status: string; dueDate: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => setInvoices([]));
  }, []);

  return (
    <div>
      <TopBar title="Invoices" />
      <div className="p-6 lg:p-10">
        {invoices === null && <Skeleton className="h-48" />}
        {invoices?.length === 0 && (
          <EmptyState icon={<FileText size={32} />} title="No invoices yet" description="Invoices appear here once a project or package is billed." />
        )}
        {invoices && invoices.length > 0 && (
          <div className="grid gap-4">
            {invoices.map((inv) => (
              <div key={inv._id} className="card-surface flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <p className="font-medium">{inv.invoiceNumber}</p>
                  <p className="text-xs text-mist-100/50">{inv.service} · Due {formatDate(inv.dueDate)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display font-semibold">{formatCurrency(inv.total, inv.currency as "USD" | "INR")}</span>
                  <StatusBadge status={inv.status} />
                  <Button size="sm" variant="ghost"><Eye size={14} /></Button>
                  <Button size="sm" variant="ghost"><Download size={14} /></Button>
                  {inv.status !== "Paid" && <Button size="sm">Pay Now</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
