import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const query = session.role === "client" ? { client: session.userId } : {};
  const invoices = await Invoice.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ invoices });
}
