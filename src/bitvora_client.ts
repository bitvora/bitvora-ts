import { createHmac } from "node:crypto";
import { BitcoinWithdrawalResponse } from "./types";

export class BitvoraClient {
  constructor(private apiKey: string, private network: string) {
    if (!this.isValidNetwork()) {
      throw new Error("Invalid network");
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getNetwork(): string {
    return this.network;
  }

  public isValidNetwork(): boolean {
    return (
      this.network === "mainnet" ||
      this.network === "testnet" ||
      this.network === "signet"
    );
  }

  public getHost(): string {
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

  public validateWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const hmac = createHmac("sha256", secret);
    hmac.update(payload);
    const hash = hmac.digest("hex");
    return hash === signature;
  }

  public async sendBitcoin(
    destination: string,
    amount_sats: number
  ): Promise<BitcoinWithdrawalResponse> {
    let response = await fetch(`${this.getHost()}/v1/bitcoin/send/confirm`, {
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

    return await response.json();
  }

  public async getWithdrawal(withdrawalId: string): Promise<any> {
    let response = await fetch(
      `${this.getHost()}/v1/bitcoin/withdrawals/${withdrawalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return await response.json();
  }
}
