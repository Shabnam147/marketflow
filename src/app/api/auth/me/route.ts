import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ user: null }, { status: 200 });

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({
    user: {
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
}
