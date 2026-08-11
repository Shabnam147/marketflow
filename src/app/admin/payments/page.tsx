"use client";
import TopBar from "@/components/dashboard/TopBar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import { DollarSign, CheckCircle2, Clock, XCircle } from "lucide-react";

// Wire to GET /api/admin/payments (aggregates over Payment + Invoice).
export default function AdminPaymentsPage() {
  return (
    <div>
      <TopBar title="Payments" />
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardCard label="Revenue (MTD)" value="$48,200" icon={DollarSign} />
          <DashboardCard label="Paid Invoices" value="41" icon={CheckCircle2} />
          <DashboardCard label="Pending" value="9" icon={Clock} />
          <DashboardCard label="Failed" value="2" icon={XCircle} />
        </div>
        <div className="mt-8">
          <EmptyState title="Payment history" description="Connect Stripe or Razorpay and MONGODB_URI to see live transactions." />
        </div>
      </div>
    </div>
  );
}
