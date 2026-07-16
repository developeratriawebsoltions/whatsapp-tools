import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStringValue, readRequestBody } from "@/lib/auth-request";

export const dynamic = "force-dynamic";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await readRequestBody(req);

    const email = getStringValue(body, ["email", "emailAddress"]).trim().toLowerCase();
    const phone = getStringValue(body, ["phone", "phoneNumber", "mobile", "Phone"]).trim();

    if (!email && !phone) {
      return NextResponse.json({ success: false, message: "Email or phone is required." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: email ? { email } : { phone },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully.", data: { email: user.email, phone: user.phone } }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
