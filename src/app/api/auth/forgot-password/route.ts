import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(`forgot:${ip}`, 5, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ success: true }); // Don't leak validation details.

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });

  // Always respond success, whether or not the account exists, to avoid
  // leaking which emails are registered.
  if (user) {
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetPasswordToken}`;
    await sendEmail(user.email, "Reset your MarketFlow password", `<p><a href="${resetUrl}">${resetUrl}</a></p>`);
  }

  return NextResponse.json({ success: true });
}
