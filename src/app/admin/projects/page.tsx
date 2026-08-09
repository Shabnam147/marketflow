"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { FolderKanban } from "lucide-react";

interface Project {
  _id: string; name: string; client: { fullName: string }; status: string; progress: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then((d) => setProjects(d.projects || [])).catch(() => setProjects([]));
  }, []);

  async function updateProgress(projectId: string, progress: number) {
    setProjects((prev) => prev?.map((p) => (p._id === projectId ? { ...p, progress } : p)) || null);
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, progress }),
    });
  }

  return (
    <div>
      <TopBar title="Projects" />
      <div className="p-6 lg:p-10">
        {projects === null && <Skeleton className="h-64" />}
        {projects?.length === 0 && <EmptyState icon={<FolderKanban size={32} />} title="No projects yet" description="Create a project from an approved service request." />}
        {projects && projects.length > 0 && (
          <div className="grid gap-4">
            {projects.map((p) => (
              <div key={p._id} className="card-surface flex flex-wrap items-center gap-4 p-6">
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-mist-100/50">{p.client?.fullName}</p>
                </div>
                <StatusBadge status={p.status} />
                <div className="flex w-40 items-center gap-2">
                  <ProgressBar value={p.progress} />
                  <span className="text-xs text-mist-100/50">{p.progress}%</span>
                </div>
                <input
                  type="range" min={0} max={100} value={p.progress}
                  onChange={(e) => updateProgress(p._id, Number(e.target.value))}
                  className="w-32"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
