import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import EmptyState from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Blog & Resources", description: "Marketing insights from the MarketFlow team." };
export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
    return posts;
  } catch {
    return null; // DB not configured yet
  }
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="section-y">
      <div className="container-xl">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Blog &amp; Resources</h1>
        <p className="mt-4 max-w-xl text-mist-100/70">Practical guides on SEO, ads, social and growth.</p>

        {posts === null && (
          <div className="mt-10 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            Connect MONGODB_URI and run <code>npm run seed</code> to populate blog posts.
          </div>
        )}

        {posts && posts.length === 0 && (
          <div className="mt-12">
            <EmptyState title="No articles yet" description="Published posts will appear here." />
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card-surface flex flex-col gap-3 p-6 hover:border-electric-400/40">
                <span className="w-fit rounded-full bg-electric-500/10 px-3 py-1 text-xs text-electric-400">{post.category}</span>
                <h3 className="font-display text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-mist-100/60">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
