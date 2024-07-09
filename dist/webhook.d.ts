import { WebhookEvent } from "./types";
export declare class Webhook {
    private clientSecret;
    constructor(clientSecret: string);
    validateSignature(payload: string, signature: string): boolean;
    processWebhook(event: WebhookEvent, signature: string): boolean;
}
//# sourceMappingURL=webhook.d.ts.map