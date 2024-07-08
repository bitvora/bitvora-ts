import { createHmac } from "crypto";
import { WebhookEvent, WebhookPayloads } from "./types";

export class Webhook {
  constructor(private clientSecret: string) {}

  public validateSignature(payload: string, signature: string): boolean {
    const hmac = createHmac("sha256", this.clientSecret);
    hmac.update(payload);
    const hash = hmac.digest("hex");
    return hash === signature;
  }

  public processWebhook<T extends keyof WebhookPayloads>(
    event: WebhookEvent<WebhookPayloads[T]>,
    signature: string
  ): WebhookPayloads[T] | null {
    const payloadString = JSON.stringify(event);
    if (this.validateSignature(payloadString, signature)) {
      return event.data;
    }
    return null;
  }
}
