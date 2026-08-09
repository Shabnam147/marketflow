import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

const schema = z.object({ token: z.string(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await connectDB();
  const user = await User.findOne({
    resetPasswordToken: parsed.data.token,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) return NextResponse.json({ error: "That reset link is invalid or expired." }, { status: 400 });

  user.passwordHash = await hashPassword(parsed.data.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ success: true });
}
