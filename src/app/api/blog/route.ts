import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { getSessionFromCookies } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const query: Record<string, unknown> = { isPublished: true };
  if (category) query.category = category;

  const posts = await BlogPost.find(query).sort({ publishedAt: -1 }).select("-content").lean();
  return NextResponse.json({ posts });
}

const createSchema = z.object({
  title: z.string().min(3),
  category: z.string(),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const post = await BlogPost.create({
    ...parsed.data,
    slug: slugify(parsed.data.title),
    author: session.userId,
    publishedAt: parsed.data.isPublished ? new Date() : undefined,
  });

  return NextResponse.json({ post }, { status: 201 });
}
