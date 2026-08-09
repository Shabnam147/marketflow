import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  await connectDB();
  const user = await User.findOne({ emailVerifyToken: token }).select("+emailVerifyToken");
  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  await user.save();

  return NextResponse.json({ success: true });
}
