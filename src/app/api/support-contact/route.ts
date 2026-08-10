import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getSessionFromCookies } from "@/lib/auth";

// Resolves the "agency support" recipient for a client's chat window.
// For now this is simply the first admin account; extend this to route to
// a client's specifically assigned account manager once that relationship
// exists on ClientProfile.
export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const admin = await User.findOne({ role: "admin" }).select("_id fullName").lean();
  if (!admin) return NextResponse.json({ error: "No support account configured yet." }, { status: 404 });

  return NextResponse.json({ id: String(admin._id), name: admin.fullName });
}
