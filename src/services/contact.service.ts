import { contactRepository, type ContactInput } from '../repositories/contact.repository';

export class ContactService {
  async createContact(data: ContactInput) {
    const normalizedPhone = data.phone?.trim();
    if (!normalizedPhone) {
      throw new Error('Phone number is required.');
    }

    const existingContact = await contactRepository.findByPhone(normalizedPhone);
    if (existingContact) {
      throw new Error('Contact with this phone number already exists.');
    }

    return contactRepository.create({
      ...data,
      phone: normalizedPhone,
      name: data.name.trim(),
      email: data.email?.trim() || null,
      tags: data.tags?.trim() || null,
    });
  }

  async getContacts() {
    return contactRepository.findAll();
  }

  async getContactById(id: string) {
    return contactRepository.findById(id);
  }

  async updateContact(id: string, data: Partial<ContactInput>) {
    const existingContact = await contactRepository.findById(id);
    if (!existingContact) {
      throw new Error('Contact not found.');
    }

    if (data.phone) {
      const normalizedPhone = data.phone.trim();
      const phoneOwner = await contactRepository.findByPhone(normalizedPhone);
      if (phoneOwner && phoneOwner.id !== id) {
        throw new Error('Contact with this phone number already exists.');
      }

      data.phone = normalizedPhone;
    }

    if (data.name !== undefined) {
      data.name = data.name.trim();
    }

    if (data.email !== undefined) {
      data.email = data.email?.trim() || null;
    }

    if (data.tags !== undefined) {
      data.tags = data.tags?.trim() || null;
    }

    return contactRepository.update(id, data);
  }

  async deleteContact(id: string) {
    const existingContact = await contactRepository.findById(id);
    if (!existingContact) {
      throw new Error('Contact not found.');
    }

    return contactRepository.delete(id);
  }
}

export const contactService = new ContactService();