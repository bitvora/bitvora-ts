import { createHmac } from "crypto";
import { WebhookEvent } from "./types";

export class Webhook {
  constructor(private clientSecret: string) {}

  public validateSignature(payload: string, signature: string): boolean {
    const hmac = createHmac("sha256", this.clientSecret);
    hmac.update(payload);
    const hash = hmac.digest("hex");
    return hash === signature;
  }

  public processWebhook(event: WebhookEvent, signature: string): boolean {
    const payloadString = JSON.stringify(event);
    return this.validateSignature(payloadString, signature);
  }
}
