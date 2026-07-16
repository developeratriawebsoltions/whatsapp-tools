import { prisma } from '@/lib/prisma';
import type { Contact } from '@prisma/client';

export type ContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  tags?: string | null;
};

export class ContactRepository {
  async create(data: ContactInput): Promise<Contact> {
    return prisma.contact.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        tags: data.tags ?? null,
      },
    });
  }

  async findById(id: string): Promise<Contact | null> {
    return prisma.contact.findUnique({
      where: { id },
    });
  }

  async findByPhone(phone: string): Promise<Contact | null> {
    return prisma.contact.findUnique({
      where: { phone },
    });
  }

  async findAll(): Promise<Contact[]> {
    return prisma.contact.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, data: Partial<ContactInput>): Promise<Contact> {
    return prisma.contact.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.email !== undefined ? { email: data.email ?? null } : {}),
        ...(data.tags !== undefined ? { tags: data.tags ?? null } : {}),
      },
    });
  }

  async delete(id: string): Promise<Contact> {
    return prisma.contact.delete({
      where: { id },
    });
  }
}

export const contactRepository = new ContactRepository();