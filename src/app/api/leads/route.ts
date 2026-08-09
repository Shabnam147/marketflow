import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Lead, { LEAD_STATUSES } from "@/models/Lead";
import { getSessionFromCookies } from "@/lib/auth";

// Admin/employee-only CRM endpoints for the lead Kanban board.

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "admin" && session.role !== "employee")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const query = status ? { status } : {};
  const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ leads });
}

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterested: z.string().optional(),
  estimatedValue: z.number().optional(),
  source: z.enum(["Contact Form", "Consultation Booking", "Website Form", "Manual Entry", "Free Tool"]).default("Manual Entry"),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "admin" && session.role !== "employee")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createLeadSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const lead = await Lead.create(parsed.data);
  return NextResponse.json({ lead }, { status: 201 });
}

const updateStatusSchema = z.object({
  leadId: z.string(),
  status: z.enum(LEAD_STATUSES),
});

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "admin" && session.role !== "employee")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateStatusSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const lead = await Lead.findByIdAndUpdate(
    parsed.data.leadId,
    { status: parsed.data.status },
    { new: true }
  );
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  return NextResponse.json({ lead });
}
