import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

type LeanBlogPost = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug: params.slug, isPublished: true }).lean<LeanBlogPost>();
    if (!post) return {};
    return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: LeanBlogPost | null;
  try {
    await connectDB();
    post = await BlogPost.findOne({ slug: params.slug, isPublished: true }).lean<LeanBlogPost>();
  } catch {
    post = null;
  }
  if (!post) notFound();

  return (
    <article className="section-y">
      <div className="container-xl max-w-3xl">
        <span className="rounded-full bg-electric-500/10 px-3 py-1 text-xs text-electric-400">{post.category}</span>
        <h1 className="mt-4 font-display text-4xl font-bold">{post.title}</h1>
        <p className="mt-4 text-mist-100/70">{post.excerpt}</p>
        <div className="prose prose-invert mt-10 max-w-none whitespace-pre-wrap text-mist-100/80">{post.content}</div>
      </div>
    </article>
  );
}
