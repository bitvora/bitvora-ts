import { createHmac } from "node:crypto";

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
}
