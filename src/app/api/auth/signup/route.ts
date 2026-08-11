import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ClientProfile from "@/models/ClientProfile";
import { hashPassword, signToken, authCookieOptions, COOKIE_NAME } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";
import crypto from "crypto";

const signupSchema = z
  .object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(6).max(20).optional(),
    companyName: z.string().max(150).optional(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
    agreedToTerms: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(`signup:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const json = await req.json();
  const parsed = signupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { fullName, email, phone, companyName, password } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const emailVerifyToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    phone,
    companyName,
    passwordHash,
    role: "client",
    emailVerifyToken,
  });

  await ClientProfile.create({ user: user._id });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${emailVerifyToken}`;
  await sendEmail(
    user.email,
    "Verify your MarketFlow account",
    `<p>Hi ${fullName},</p><p>Confirm your email to activate your account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  );

  const token = await signToken({ userId: user._id.toString(), role: user.role, email: user.email });

  const res = NextResponse.json({
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
  res.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return res;
}
