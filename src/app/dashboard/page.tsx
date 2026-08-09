"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Activity, Users, MousePointerClick, DollarSign, TrendingUp, Percent } from "lucide-react";

// Demo chart data — replace with a /api/dashboard-metrics endpoint backed by
// MarketingReport documents once real client data is flowing.
const trafficData = [
  { month: "Feb", visitors: 2100 }, { month: "Mar", visitors: 2800 }, { month: "Apr", visitors: 3400 },
  { month: "May", visitors: 4100 }, { month: "Jun", visitors: 5200 }, { month: "Jul", visitors: 6300 },
];
const leadsData = [
  { month: "Feb", leads: 12 }, { month: "Mar", leads: 18 }, { month: "Apr", leads: 22 },
  { month: "May", leads: 27 }, { month: "Jun", leads: 34 }, { month: "Jul", leads: 41 },
];

export default function DashboardOverviewPage() {
  const [name, setName] = useState("there");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => d.user && setName(d.user.fullName.split(" ")[0]))
      .catch(() => {});
  }, []);

  return (
    <div>
      <TopBar title="Overview" />
      <div className="p-6 lg:p-10">
        <h2 className="font-display text-2xl font-bold">{greeting}, {name}!</h2>
        <p className="mt-1 text-sm text-mist-100/60">Here&apos;s how your campaigns are performing.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <DashboardCard label="Active Campaigns" value="4" icon={Activity} />
          <DashboardCard label="Leads Generated" value="41" icon={Users} trend="+18%" />
          <DashboardCard label="Website Visitors" value="6,300" icon={MousePointerClick} trend="+21%" />
          <DashboardCard label="Ad Spend" value="$3,240" icon={DollarSign} />
          <DashboardCard label="Conversion Rate" value="2.6%" icon={Percent} trend="+0.4%" />
          <DashboardCard label="Current ROI" value="3.8x" icon={TrendingUp} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-6">
            <h3 className="font-display font-semibold">Website Traffic</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#8b8fa3" fontSize={12} />
                  <YAxis stroke="#8b8fa3" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#0f1424", border: "1px solid #ffffff20", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="visitors" stroke="#4f8bff" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="font-display font-semibold">Leads Per Month</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#8b8fa3" fontSize={12} />
                  <YAxis stroke="#8b8fa3" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#0f1424", border: "1px solid #ffffff20", borderRadius: 8 }} />
                  <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card-surface mt-6 p-6">
          <h3 className="font-display font-semibold">Campaign Performance</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Impressions", "128,400"], ["Clicks", "3,210"], ["CTR", "2.5%"],
              ["CPC", "$1.02"], ["Conversions", "84"], ["Conv. Rate", "2.6%"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-mist-100/50">{label}</p>
                <p className="font-display text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface mt-6 p-6">
          <h3 className="font-display font-semibold">Recent Activity</h3>
          <ul className="mt-4 flex flex-col divide-y divide-white/5">
            {[
              "SEO report uploaded", "Campaign updated", "New lead received", "Invoice generated", "Strategy meeting scheduled",
            ].map((a) => (
              <li key={a} className="py-3 text-sm text-mist-100/70">{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
