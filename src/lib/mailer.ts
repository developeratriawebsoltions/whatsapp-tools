import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST?.trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const smtpFrom = process.env.SMTP_FROM?.trim();

const transporter = smtpHost && smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

export async function sendOtpEmail(to: string, otp: string) {
  if (!to || !otp) return false;

  if (!transporter) {
    console.warn(`[mailer] SMTP not configured. OTP for ${to}: ${otp}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: smtpFrom || smtpUser || "no-reply@example.com",
      to,
      subject: "Your verification code",
      html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    });

    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}
