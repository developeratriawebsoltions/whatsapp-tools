import { NextRequest, NextResponse } from 'next/server';
import { contactService } from '@/services/contact.service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contact = await contactService.getContactById(id);

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact not found.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, contact }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const contact = await contactService.updateContact(id, body);

    return NextResponse.json({ success: true, contact }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contact = await contactService.deleteContact(id);

    return NextResponse.json({ success: true, contact }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 },
    );
  }
}
