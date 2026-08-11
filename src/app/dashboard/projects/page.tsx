"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { CheckCircle2, Circle, FolderKanban } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Task { _id: string; title: string; isCompleted: boolean; }
interface Project {
  _id: string; name: string; service: { name: string }; startDate: string; deadline?: string;
  progress: number; status: string; tasks: Task[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .catch(() => setProjects([]));
  }, []);

  return (
    <div>
      <TopBar title="Projects" />
      <div className="p-6 lg:p-10">
        {projects === null && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" /><Skeleton className="h-64" />
          </div>
        )}
        {projects?.length === 0 && (
          <EmptyState
            icon={<FolderKanban size={32} />}
            title="No projects yet"
            description="Once a service request is approved, your project will appear here."
          />
        )}
        {projects && projects.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((p) => (
              <div key={p._id} className="card-surface p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                    <p className="text-xs text-mist-100/50">{p.service?.name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-4 flex justify-between text-xs text-mist-100/50">
                  <span>Start: {formatDate(p.startDate)}</span>
                  {p.deadline && <span>Deadline: {formatDate(p.deadline)}</span>}
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-mist-100/60">
                    <span>Progress</span><span>{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} />
                </div>
                {p.tasks?.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {p.tasks.map((t) => (
                      <li key={t._id} className="flex items-center gap-2 text-sm text-mist-100/70">
                        {t.isCompleted ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Circle size={15} className="text-mist-100/30" />}
                        {t.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
