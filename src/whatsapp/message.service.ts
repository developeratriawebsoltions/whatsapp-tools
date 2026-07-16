import { clientManager } from "./client";
import { sessionManager } from "./session.manager";

class MessageService {
  async sendMessage(number: string, message: string) {
    const client = clientManager.getClient();

    if (!client) {
      throw new Error("WhatsApp client is not available.");
    }

    if (!sessionManager.getState().connected) {
      throw new Error("WhatsApp client is not connected.");
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, "");
    const chatId = `${sanitizedNumber}@c.us`;

    return client.sendMessage(chatId, message);
  }
}

export const messageService = new MessageService();
