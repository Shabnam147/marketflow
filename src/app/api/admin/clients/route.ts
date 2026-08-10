import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ClientProfile from "@/models/ClientProfile";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "admin" && session.role !== "employee")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const clients = await User.find({ role: "client" }).select("-passwordHash").sort({ createdAt: -1 }).lean();
  const profiles = await ClientProfile.find({ user: { $in: clients.map((c) => String(c._id)) } }).lean();
  const profileByUser = new Map(profiles.map((p) => [String(p.user), p]));

  return NextResponse.json({
    clients: clients.map((c) => ({ ...c, profile: profileByUser.get(String(c._id)) || null })),
  });
}

const disableSchema = z.object({ userId: z.string(), isDisabled: z.boolean() });

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = disableSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const client = await User.findOneAndUpdate(
    { _id: parsed.data.userId, role: "client" },
    { isDisabled: parsed.data.isDisabled },
    { new: true }
  ).select("-passwordHash");

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  return NextResponse.json({ client });
}
