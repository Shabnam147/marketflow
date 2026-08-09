"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  return (
    <div>
      <TopBar title="Settings" />
      <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-10">
        <div className="card-surface p-6">
          <h3 className="font-display font-semibold">Profile</h3>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Full name" defaultValue={user?.fullName} />
            <Input label="Email" defaultValue={user?.email} disabled />
            <Input label="Phone" />
            <Input label="Company name" />
            <Input label="Website" />
            <Input label="Industry" />
            <Button className="w-fit">Save Changes</Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card-surface p-6">
            <h3 className="font-display font-semibold">Change Password</h3>
            <div className="mt-4 flex flex-col gap-4">
              <Input label="Current password" type="password" />
              <Input label="New password" type="password" />
              <Button variant="outline" className="w-fit">Update Password</Button>
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="font-display font-semibold">Notification Preferences</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-mist-100/70">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Email notifications</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> In-app notifications</label>
            </div>
          </div>

          <div className="card-surface border-red-500/20 p-6">
            <h3 className="font-display font-semibold text-red-300">Danger Zone</h3>
            <p className="mt-2 text-sm text-mist-100/60">Deleting your account is permanent and cannot be undone.</p>
            <Button variant="outline" className="mt-4 border-red-500/40 text-red-300 hover:border-red-400">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
