import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import ServiceRequest, { SERVICE_REQUEST_STATUSES } from "@/models/ServiceRequest";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getSessionFromCookies } from "@/lib/auth";

const createSchema = z.object({
  service: z.string(),
  businessName: z.string().min(2),
  website: z.string().optional(),
  targetAudience: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  monthlyBudget: z.number().optional(),
  additionalInfo: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const serviceRequest = await ServiceRequest.create({
    ...parsed.data,
    client: session.userId,
    statusHistory: [{ status: "Pending", changedAt: new Date() }],
  });

  // Notify all admins of the new request.
  const admins = await User.find({ role: "admin" }).select("_id").lean<{ _id: unknown }[]>();
  await Notification.insertMany(
    admins.map((admin) => ({
      user: String(admin._id),
      type: "service_request_status_changed",
      title: "New service request",
      body: `${parsed.data.businessName} requested ${parsed.data.service}.`,
      link: `/admin/leads`,
    }))
  );

  return NextResponse.json({ serviceRequest }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const query = session.role === "client" ? { client: session.userId } : {};
  const requests = await ServiceRequest.find(query)
    .populate("service", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ requests });
}

const updateStatusSchema = z.object({
  requestId: z.string(),
  status: z.enum(SERVICE_REQUEST_STATUSES),
  note: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role === "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateStatusSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const { requestId, status, note } = parsed.data;

  const serviceRequest = await ServiceRequest.findByIdAndUpdate(
    requestId,
    { status, $push: { statusHistory: { status, changedAt: new Date(), note } } },
    { new: true }
  );
  if (!serviceRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Notification.create({
    user: serviceRequest.client,
    type: "service_request_status_changed",
    title: "Service request updated",
    body: `Your request for ${serviceRequest.businessName} is now "${status}".`,
    link: `/dashboard/requests`,
  });

  return NextResponse.json({ serviceRequest });
}
