import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";
import Lead from "@/models/Lead";
import { sendEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  serviceRequired: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(5).max(3000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });
  }

  const parsed = contactSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const data = parsed.data;

  await ContactSubmission.create(data);

  // Every contact submission also becomes a lead in the CRM.
  await Lead.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    source: "Contact Form",
    serviceInterested: data.serviceRequired,
    estimatedValue: undefined,
    notes: data.message ? [{ text: data.message, addedAt: new Date() }] : [],
  });

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@marketflow.agency";
  await sendEmail(
    adminEmail,
    `New contact form lead: ${data.name}`,
    `<p>${data.name} (${data.email}) submitted the contact form.</p><p>${data.message}</p>`
  );

  return NextResponse.json({
    message: "Thanks! Our team will contact you within 24 hours.",
  });
}
