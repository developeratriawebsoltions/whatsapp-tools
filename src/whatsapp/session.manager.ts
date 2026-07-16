export type WhatsappConnectionStatus = "idle" | "connecting" | "qr" | "connected" | "disconnected" | "error";

interface SessionState {
  status: WhatsappConnectionStatus;
  connected: boolean;
  qr: string | null;
  error: string | null;
}

class SessionManager {
  private state: SessionState = {
    status: "idle",
    connected: false,
    qr: null,
    error: null,
  };

  setStatus(status: WhatsappConnectionStatus, error?: string | null) {
    this.state = {
      ...this.state,
      status,
      connected: status === "connected",
      error: error ?? null,
    };
  }

  setQr(qr: string | null) {
    this.state = {
      ...this.state,
      qr,
    };
  }

  getState() {
    return {
      ...this.state,
    };
  }

  reset() {
    this.state = {
      status: "idle",
      connected: false,
      qr: null,
      error: null,
    };
  }
}

export const sessionManager = new SessionManager();
 