import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { getSessionFromCookies } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const services = await Service.find({ isActive: true }).sort({ name: 1 }).lean();
  return NextResponse.json({ services });
}

const createSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  features: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  startingPrice: z.number(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const service = await Service.create({ ...parsed.data, slug: slugify(parsed.data.name) });
  return NextResponse.json({ service }, { status: 201 });
}

const updateSchema = z.object({
  serviceId: z.string(),
  startingPrice: z.number().optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const { serviceId, ...update } = parsed.data;
  const service = await Service.findByIdAndUpdate(serviceId, update, { new: true });
  return NextResponse.json({ service });
}
