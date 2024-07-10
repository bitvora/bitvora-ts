"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitvoraClient = void 0;
const node_crypto_1 = require("node:crypto");
class BitvoraClient {
    constructor(apiKey, network) {
        this.apiKey = apiKey;
        this.network = network;
        if (!this.isValidNetwork()) {
            throw new Error("Invalid network");
        }
    }
    getApiKey() {
        return this.apiKey;
    }
    getNetwork() {
        return this.network;
    }
    isValidNetwork() {
        return (this.network === "mainnet" ||
            this.network === "testnet" ||
            this.network === "signet");
    }
    getHost() {
        switch (this.network) {
            case "mainnet":
                return "https://api.bitvora.com";
            case "testnet":
                return "https://api.testnet.bitvora.com";
            case "signet":
                return "https://api.signet.bitvora.com";
            default:
                return "";
        }
    }
    validateWebhookSignature(payload, signature, secret) {
        const hmac = (0, node_crypto_1.createHmac)("sha256", secret);
        hmac.update(payload);
        const hash = hmac.digest("hex");
        return hash === signature;
    }
}
exports.BitvoraClient = BitvoraClient;
//# sourceMappingURL=bitvora_client.js.map