"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const { createHmac } = require("node:crypto");
class Webhook {
    constructor(clientSecret) {
        this.clientSecret = clientSecret;
    }
    validateSignature(payload, signature) {
        const hmac = createHmac("sha256", this.clientSecret);
        hmac.update(payload);
        const hash = hmac.digest("hex");
        return hash === signature;
    }
    processWebhook(event, signature) {
        const payloadString = JSON.stringify(event);
        return this.validateSignature(payloadString, signature);
    }
}
exports.Webhook = Webhook;
//# sourceMappingURL=webhook.js.map