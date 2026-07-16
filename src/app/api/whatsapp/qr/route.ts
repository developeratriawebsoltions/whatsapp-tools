import { NextResponse } from "next/server";
import whatsappService from "@/services/whatsapp.service";

export async function GET() {
  return NextResponse.json(whatsappService.getQRCode(), { status: 200 });
}
