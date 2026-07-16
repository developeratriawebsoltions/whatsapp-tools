import { NextRequest, NextResponse } from 'next/server';
import { contactService } from '@/services/contact.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const contact = await contactService.createContact(body);

    return NextResponse.json(
      {
        success: true,
        contact,
      },
      { status: 201 },
    );
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

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
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
    }

    const contacts = await contactService.getContacts();
    return NextResponse.json({ success: true, contacts }, { status: 200 });
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

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact ID is required.',
        },
        { status: 400 },
      );
    }

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

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact ID is required.',
        },
        { status: 400 },
      );
    }

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