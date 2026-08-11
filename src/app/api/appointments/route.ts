import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import Lead from "@/models/Lead";
import { sendEmail } from "@/lib/mailer";
import { getSessionFromCookies } from "@/lib/auth";

const AVAILABLE_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

// GET /api/appointments?date=2026-08-10  -> which slots are still free that day
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");

  if (dateParam) {
    const start = new Date(dateParam);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const booked = await Appointment.find({
      date: { $gte: start, $lt: end },
      status: { $ne: "Cancelled" },
    }).select("timeSlot");

    const bookedSlots = new Set(booked.map((b) => b.timeSlot));
    const available = AVAILABLE_SLOTS.filter((slot) => !bookedSlots.has(slot));
    return NextResponse.json({ available });
  }

  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const query = session.role === "client" ? { client: session.userId } : {};
  const appointments = await Appointment.find(query).sort({ date: 1 }).lean();
  return NextResponse.json({ appointments });
}

const bookSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().optional(),
  date: z.string(),
  timeSlot: z.enum(AVAILABLE_SLOTS as [string, ...string[]]),
});

export async function POST(req: NextRequest) {
  const parsed = bookSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const session = await getSessionFromCookies();
  const { date, ...rest } = parsed.data;

  try {
    const appointment = await Appointment.create({
      ...rest,
      date: new Date(date),
      client: session?.userId,
      status: "Pending",
    });

    await Lead.create({
      name: rest.name,
      email: rest.email,
      phone: rest.phone,
      source: "Consultation Booking",
      serviceInterested: rest.service,
    });

    await sendEmail(
      rest.email,
      "Your MarketFlow consultation is booked",
      `<p>Hi ${rest.name},</p><p>Your free consultation is confirmed for ${date} at ${rest.timeSlot}.</p>`
    );

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err: unknown) {
    // Unique index on (date, timeSlot) throws E11000 on double-booking.
    if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "That time slot was just booked. Please choose another." }, { status: 409 });
    }
    throw err;
  }
}
