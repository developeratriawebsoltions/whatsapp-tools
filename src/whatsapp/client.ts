import { existsSync } from "fs";
import { spawnSync } from "child_process";
import { Client, LocalAuth } from "whatsapp-web.js";
import { qrService } from "./qr.service";
import { sessionManager } from "./session.manager";

class ClientManager {
    private client: Client | null = null;
    private initializingPromise: Promise<void> | null = null;

    private resolveExecutablePath() {
        const candidates = [
            process.env.PUPPETEER_EXECUTABLE_PATH,
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/opt/chromium/chrome",
            "/root/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome",
        ].filter(Boolean) as string[];

        const existing = candidates.find((candidate) => existsSync(candidate));
        if (existing) {
            return existing;
        }

        const which = spawnSync("which", ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"], {
            encoding: "utf8",
        });

        if (which.status === 0) {
            const firstMatch = which.stdout.split(/\r?\n/).find(Boolean);
            if (firstMatch) {
                return firstMatch.trim();
            }
        }

        return undefined;
    }

    getClient() {
        if (!this.client) {
            const executablePath = this.resolveExecutablePath();

            this.client = new Client({
                authStrategy: new LocalAuth({
                    clientId: "default",
                }),
                puppeteer: {
                    headless: true,
                    ...(executablePath ? { executablePath } : {}),
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-extensions",
                        "--disable-gpu",
                    ],
                },
            });

            this.client.on("qr", (qr: string) => {
                qrService.setQr(qr);
                sessionManager.setStatus("qr");
            });

            this.client.on("ready", () => {
                qrService.setQr(null);
                sessionManager.setStatus("connected");
            });

            this.client.on("auth_failure", (message: string) => {
                sessionManager.setStatus("error", message || "Authentication failed.");
            });

            this.client.on("disconnected", (reason: string) => {
                sessionManager.setStatus("disconnected", reason || "Disconnected");
            });
        }

        return this.client;
    }

    async connect() {
        const client = this.getClient();

        if (this.initializingPromise) {
            return this.initializingPromise;
        }

        sessionManager.setStatus("connecting");

        this.initializingPromise = client.initialize().catch((error: unknown) => {
            sessionManager.setStatus("error", error instanceof Error ? error.message : "Failed to initialize WhatsApp client.");
            throw error;
        });

        try {
            await this.initializingPromise;
        } finally {
            this.initializingPromise = null;
        }
    }

    async disconnect() {
        if (!this.client) {
            sessionManager.setStatus("disconnected");
            return;
        }

        try {
            await this.client.destroy();
        } catch (error) {
            console.error("Failed to destroy WhatsApp client:", error);
        } finally {
            this.client = null;
            qrService.setQr(null);
            sessionManager.setStatus("disconnected");
        }
    }
}

export const clientManager = new ClientManager();