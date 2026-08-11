"use client";
import TopBar from "@/components/dashboard/TopBar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Users, UserPlus, FolderKanban, DollarSign, FileWarning, CalendarClock } from "lucide-react";

// Wire these six cards to a single /api/admin/overview aggregation route
// (Users.count, Lead.count new this week, Project active count,
// Invoice paid-sum, Invoice pending-count, Appointment upcoming-count).
export default function AdminOverviewPage() {
  return (
    <div>
      <TopBar title="Admin Overview" />
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <DashboardCard label="Total Clients" value="128" icon={Users} />
          <DashboardCard label="New Leads" value="17" icon={UserPlus} trend="+5 today" />
          <DashboardCard label="Active Projects" value="34" icon={FolderKanban} />
          <DashboardCard label="Revenue (MTD)" value="$48,200" icon={DollarSign} />
          <DashboardCard label="Pending Invoices" value="9" icon={FileWarning} />
          <DashboardCard label="Upcoming Meetings" value="6" icon={CalendarClock} />
        </div>
        <p className="mt-8 text-sm text-mist-100/50">
          Manage clients, leads, projects, appointments, payments, services and blog content from the sidebar.
        </p>
      </div>
    </div>
  );
}
