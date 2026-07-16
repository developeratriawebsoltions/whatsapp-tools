import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Auth API is available.",
    endpoints: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      sendOtp: "/api/auth/send-otp",
    },
  });
}
