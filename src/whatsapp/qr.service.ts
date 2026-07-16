import { sessionManager } from "./session.manager";

class QrService {
  setQr(qr: string | null) {
    sessionManager.setQr(qr);
  }

  getQr() {
    return sessionManager.getState().qr;
  }
}

export const qrService = new QrService();
