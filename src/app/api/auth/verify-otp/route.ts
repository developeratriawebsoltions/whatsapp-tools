import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const otp = String(body.otp ?? "").trim();

    if (!otp || (!email && !phone)) {
      return NextResponse.json({ success: false, message: "Email or phone and OTP are required." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: email ? { email } : { phone },
    });

    if (!user || !user.otp || !user.otpExpiresAt) {
      return NextResponse.json({ success: false, message: "OTP not found." }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP." }, { status: 401 });
    }

    if (new Date(user.otpExpiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: "OTP has expired." }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verification successful.",
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        isPhoneVerified: true,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
