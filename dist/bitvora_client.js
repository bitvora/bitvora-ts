"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitvoraClient = void 0;
const node_crypto_1 = require("node:crypto");
const withdrawal_1 = require("./withdrawal");
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
    withdraw(destination, amount_sats) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/bitcoin/withdraw/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    destination: destination,
                    amount_sats: amount_sats,
                }),
            });
            const data = yield response.json();
            return new withdrawal_1.Withdrawal(this, data);
        });
    }
    getWithdrawal(withdrawalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/transactions/withdrawals/${withdrawalId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return yield response.json();
        });
    }
    getDeposit(depositId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/transactions/deposits/${depositId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return yield response.json();
        });
    }
    createLightningAddress(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/bitcoin/deposit/lightning-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    handle: null,
                    domain: null,
                    metadata: metadata,
                }),
            });
            return yield response.json();
        });
    }
    createCustomLightningAddress(handle, domain, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/bitcoin/deposit/lightning-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    handle: handle,
                    domain: domain,
                    metadata: metadata,
                }),
            });
            return yield response.json();
        });
    }
    createLightningInvoice(amountSats, memo, expirySeconds, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/bitcoin/deposit/lightning-invoice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    amount_sats: amountSats,
                    description: memo,
                    expiry_seconds: expirySeconds,
                    metadata: metadata,
                }),
            });
            return yield response.json();
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.getHost()}/v1/transactions/balance`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            const data = yield response.json();
            return data.data.balance;
        });
    }
}
exports.BitvoraClient = BitvoraClient;
//# sourceMappingURL=bitvora_client.js.map