import { NextResponse } from "next/server";
import whatsappService from "@/services/whatsapp.service";

export async function POST() {
  try {
    const result = await whatsappService.connect();
    console.log("WhatsApp client connected.");
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to connect WhatsApp client.", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to connect WhatsApp client.",
      },
      { status: 500 },
    );
  }
}
