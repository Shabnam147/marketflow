import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getSessionFromCookies } from "@/lib/auth";

// Conversation ID convention: sorted "clientId_adminId" so both sides resolve the same thread.
function buildConversationId(a: string, b: string) {
  return [a, b].sort().join("_");
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const withUserId = searchParams.get("with");
  if (!withUserId) return NextResponse.json({ error: "Missing 'with' param" }, { status: 400 });

  const conversationId = buildConversationId(session.userId, withUserId);
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

  await Message.updateMany(
    { conversationId, recipient: session.userId, readAt: { $exists: false } },
    { readAt: new Date() }
  );

  return NextResponse.json({ messages, conversationId });
}

const sendSchema = z.object({
  recipientId: z.string(),
  body: z.string().min(1).max(5000),
  attachments: z.array(z.object({ url: z.string(), filename: z.string() })).default([]),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = sendSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const { recipientId, body, attachments } = parsed.data;
  const conversationId = buildConversationId(session.userId, recipientId);

  const message = await Message.create({
    conversationId,
    sender: session.userId,
    recipient: recipientId,
    body,
    attachments,
  });

  const sender = await User.findById(session.userId).select("fullName").lean<{ fullName: string }>();
  await Notification.create({
    user: recipientId,
    type: "new_message",
    title: "New message",
    body: `${sender?.fullName || "Someone"} sent you a message.`,
    link: "/dashboard/messages",
  });

  // In production, also emit this over the Socket.IO server (see server/socket.ts)
  // so the recipient's chat window updates without a page refresh:
  // io.to(recipientId).emit("message:new", message);

  return NextResponse.json({ message }, { status: 201 });
}
