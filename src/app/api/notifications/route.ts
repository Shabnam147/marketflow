import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getSessionFromCookies } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const notifications = await Notification.find({ user: session.userId }).sort({ createdAt: -1 }).limit(50).lean();
  const unreadCount = await Notification.countDocuments({ user: session.userId, isRead: false });

  return NextResponse.json({ notifications, unreadCount });
}

const markReadSchema = z.object({ notificationId: z.string().optional(), all: z.boolean().optional() });

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = markReadSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  if (parsed.data.all) {
    await Notification.updateMany({ user: session.userId, isRead: false }, { isRead: true });
  } else if (parsed.data.notificationId) {
    await Notification.updateOne({ _id: parsed.data.notificationId, user: session.userId }, { isRead: true });
  }

  return NextResponse.json({ success: true });
}
