import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken, authCookieOptions, COOKIE_NAME } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(`login:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const json = await req.json();
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }
  const { email, password, rememberMe } = parsed.data;

  await connectDB();

  // Explicitly select passwordHash since the schema excludes it by default.
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || user.isDisabled) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signToken({ userId: user._id.toString(), role: user.role, email: user.email });

  const res = NextResponse.json({
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
  res.cookies.set(COOKIE_NAME, token, {
    ...authCookieOptions,
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : authCookieOptions.maxAge,
  });
  return res;
}
