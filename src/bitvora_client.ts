import { createHmac } from "node:crypto";
import {
  BitcoinDepositResponse,
  BitcoinWithdrawalResponse,
  CreateLightningAddressResponse,
  CreateLightningInvoiceResponse,
  Metadata,
} from "./types";
import { Withdrawal } from "./withdrawal";

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

  public async withdraw(
    destination: string,
    amount_sats: number
  ): Promise<Withdrawal> {
    const response = await fetch(
      `${this.getHost()}/v1/bitcoin/withdraw/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          destination: destination,
          amount_sats: amount_sats,
        }),
      }
    );

    const data = await response.json();
    return new Withdrawal(this, data);
  }

  public async getWithdrawal(
    withdrawalId: string
  ): Promise<BitcoinWithdrawalResponse> {
    const response = await fetch(
      `${this.getHost()}/v1/transactions/withdrawals/${withdrawalId}`,
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

  public async getDeposit(depositId: string): Promise<BitcoinDepositResponse> {
    const response = await fetch(
      `${this.getHost()}/v1/transactions/deposits/${depositId}`,
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

  public async createLightningAddress(
    metadata: Metadata | null
  ): Promise<CreateLightningAddressResponse> {
    const response = await fetch(
      `${this.getHost()}/v1/bitcoin/deposit/lightning-address`,
      {
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
      }
    );

    return await response.json();
  }

  public async createCustomLightningAddress(
    handle: string,
    domain: string,
    metadata: Metadata | null
  ): Promise<any> {
    const response = await fetch(
      `${this.getHost()}/v1/bitcoin/deposit/lightning-address`,
      {
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
      }
    );

    return await response.json();
  }

  public async createLightningInvoice(
    amountSats: number,
    memo: string,
    expirySeconds: number,
    metadata: Metadata | null
  ): Promise<CreateLightningInvoiceResponse> {
    const response = await fetch(
      `${this.getHost()}/v1/bitcoin/deposit/lightning-invoice`,
      {
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
      }
    );

    return await response.json();
  }

  public async getBalance(): Promise<number> {
    const response = await fetch(`${this.getHost()}/v1/transactions/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();
    return data.data.balance;
  }
}
