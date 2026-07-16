import { NextResponse } from "next/server";
import whatsappService from "@/services/whatsapp.service";

export async function POST() {
  try {
    const result = await whatsappService.disconnect();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to disconnect WhatsApp client.",
      },
      { status: 500 },
    );
  }
}
