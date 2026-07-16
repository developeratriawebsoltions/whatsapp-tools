import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getStringValue, readRequestBody } from "@/lib/auth-request";
import { execute, query } from "@/lib/mysql";

export const dynamic = "force-dynamic";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await readRequestBody(req);

    const name = getStringValue(body, ["name", "fullName", "full_name"]).trim();
    const email = getStringValue(body, ["email", "emailAddress"]).trim().toLowerCase();
    const phone = getStringValue(body, ["phone", "phoneNumber", "mobile", "Phone"]).trim();
    const password = getStringValue(body, ["password", "passwordHash"]).trim();
    const role = getStringValue(body, ["role"]).trim().toUpperCase() || "USER";

    if (!name || !password || (!email && !phone)) {
      return NextResponse.json({ success: false, message: "Name, at least one contact identifier, and password are required." }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existingUsers = await query<any>(
      'SELECT id FROM User WHERE email = ? OR phone = ? LIMIT 1',
      [email || null, phone || null]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: "Email or phone already registered." }, { status: 409 });
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = crypto.randomUUID();

    await execute(
      `INSERT INTO User (id, name, email, phone, password, role, isPhoneVerified, otp, otpExpiresAt, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        name,
        email || null,
        phone || null,
        hashedPassword,
        role === "ADMIN" ? "ADMIN" : "USER",
        0,
        otp,
        otpExpiresAt.toISOString().slice(0, 19).replace('T', ' '),
        1,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "OTP sent to phone. Please verify to complete registration.",
      data: {
        id: userId,
        name,
        email,
        phone,
        role: role === "ADMIN" ? "ADMIN" : "USER",
        isPhoneVerified: false,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
