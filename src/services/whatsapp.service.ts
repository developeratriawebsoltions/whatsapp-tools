import { clientManager } from "@/whatsapp/client";
import { messageService } from "@/whatsapp/message.service";
import { qrService } from "@/whatsapp/qr.service";
import { sessionManager } from "@/whatsapp/session.manager";

class WhatsappService {
    async connect() {
        try {
            await clientManager.connect();
            return {
                success: true,
                ...sessionManager.getState(),
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to connect WhatsApp client.";
            return {
                success: false,
                message,
                status: "error",
                connected: false,
                qr: null,
            };
        }
    }

    getQRCode() {
        return {
            success: true,
            ...sessionManager.getState(),
            qr: qrService.getQr(),
        };
    }

    getStatus() {
        return {
            success: true,
            ...sessionManager.getState(),
        };
    }

    async disconnect() {
        await clientManager.disconnect();

        return {
            success: true,
            ...sessionManager.getState(),
        };
    }

    async sendMessage(number: string, message: string) {
        return messageService.sendMessage(number, message);
    }
}

const whatsappService = new WhatsappService();

export default whatsappService;
