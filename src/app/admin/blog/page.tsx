"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Newspaper } from "lucide-react";

interface Post { _id: string; title: string; category: string; isPublished: boolean; }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    fetch("/api/blog").then((r) => r.json()).then((d) => setPosts(d.posts || [])).catch(() => setPosts([]));
  }, []);

  return (
    <div>
      <TopBar title="Blog" />
      <div className="p-6 lg:p-10">
        {posts === null && <Skeleton className="h-48" />}
        {posts?.length === 0 && <EmptyState icon={<Newspaper size={32} />} title="No posts yet" description="Create your first post via POST /api/blog." />}
        {posts && posts.length > 0 && (
          <div className="grid gap-4">
            {posts.map((p) => (
              <div key={p._id} className="card-surface flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-mist-100/50">{p.category}</p>
                </div>
                <span className={p.isPublished ? "text-emerald-400 text-xs" : "text-yellow-400 text-xs"}>
                  {p.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
