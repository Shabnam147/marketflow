import nodemailer from "nodemailer";

/**
 * Sends transactional email via SMTP (Nodemailer) if SMTP_* env vars are set,
 * otherwise logs to the console so local development never crashes.
 * Swap this out for Resend by POSTing to https://api.resend.com/emails
 * with RESEND_API_KEY if you'd rather not run SMTP.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST) {
    console.log(`[email:dev] to=${to} subject="${subject}"`);
    return { delivered: false, dev: true };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: EMAIL_FROM || "MarketFlow <hello@marketflow.agency>",
    to,
    subject,
    html,
  });

  return { delivered: true };
}
