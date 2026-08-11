"use client";
import TopBar from "@/components/dashboard/TopBar";
import EmptyState from "@/components/ui/EmptyState";
import { BarChart3 } from "lucide-react";

// Reports are created by the admin (see /admin) via the MarketingReport
// model and displayed to the client here once available for their account.
export default function ReportsPage() {
  return (
    <div>
      <TopBar title="Marketing Reports" />
      <div className="p-6 lg:p-10">
        <EmptyState
          icon={<BarChart3 size={32} />}
          title="No reports published yet"
          description="Your account manager publishes a monthly marketing report here, with visitor, lead and ROAS trends."
        />
      </div>
    </div>
  );
}
