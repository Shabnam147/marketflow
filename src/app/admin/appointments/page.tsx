"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Appointment {
  _id: string; name: string; email: string; service?: string; date: string; timeSlot: string; status: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    fetch("/api/appointments").then((r) => r.json()).then((d) => setAppointments(d.appointments || [])).catch(() => setAppointments([]));
  }, []);

  return (
    <div>
      <TopBar title="Appointments" />
      <div className="p-6 lg:p-10">
        {appointments === null && <Skeleton className="h-64" />}
        {appointments?.length === 0 && <EmptyState icon={<CalendarClock size={32} />} title="No appointments booked" description="Consultation bookings will appear here." />}
        {appointments && appointments.length > 0 && (
          <div className="card-surface overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-mist-100/50">
                <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Service</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Time</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td className="px-6 py-4">{a.name}<br /><span className="text-xs text-mist-100/40">{a.email}</span></td>
                    <td className="px-6 py-4 text-mist-100/70">{a.service || "—"}</td>
                    <td className="px-6 py-4 text-mist-100/70">{formatDate(a.date)}</td>
                    <td className="px-6 py-4 text-mist-100/70">{a.timeSlot}</td>
                    <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
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
