import { createHmac } from "crypto";
import {
  BitcoinDepositResponse,
  BitcoinNetwork,
  BitcoinWithdrawalResponse,
  CreateLightningAddressResponse,
  CreateLightningInvoiceResponse,
  Currency,
  GetTransactionsResponse,
  Metadata,
} from "./types";
import { Withdrawal } from "./withdrawal";
import { LightningInvoice } from "./lightning_invoice";

export function BitvoraClient(apiKey: string, network: BitcoinNetwork) {
  return {
    getApiKey(): string {
      return apiKey;
    },

    getNetwork(): string {
      return network;
    },

    isValidNetwork(): boolean {
      return (
        this.getNetwork() === "mainnet" ||
        this.getNetwork() === "testnet" ||
        this.getNetwork() === "signet"
      );
    },

    getHost(): string {
      switch (this.getNetwork()) {
        case "mainnet":
          return "https://api.bitvora.com";
        case "testnet":
          return "https://api.testnet.bitvora.com";
        case "signet":
          return "https://api.signet.bitvora.com";
        default:
          return "";
      }
    },

    validateWebhookSignature(
      payload: string,
      signature: string,
      secret: string
    ): boolean {
      const hmac = createHmac("sha256", secret);
      hmac.update(payload);
      const hash = hmac.digest("hex");
      return hash === signature;
    },

    async withdraw(
      destination: string,
      amount: number,
      currency: Currency
    ): Promise<Withdrawal> {
      const response = await fetch(
        `${this.getHost()}/v1/bitcoin/withdraw/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
          body: JSON.stringify({
            destination: destination,
            amount: amount,
            currency: currency,
          }),
        }
      );

      const data = await response.json();

      // if response status code is not 200 or 201, throw error
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(data.message);
      }

      return new Withdrawal(this, data);
    },

    async getWithdrawal(
      withdrawalId: string
    ): Promise<BitcoinWithdrawalResponse> {
      const response = await fetch(
        `${this.getHost()}/v1/transactions/withdrawals/${withdrawalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }
      );

      return await response.json();
    },

    async getDeposit(depositId: string): Promise<BitcoinDepositResponse> {
      const response = await fetch(
        `${this.getHost()}/v1/transactions/deposits/${depositId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }
      );

      return await response.json();
    },

    async createLightningAddress(
      metadata: Metadata | null
    ): Promise<CreateLightningAddressResponse> {
      const response = await fetch(
        `${this.getHost()}/v1/bitcoin/deposit/lightning-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
          body: JSON.stringify({
            handle: null,
            domain: null,
            metadata: metadata,
          }),
        }
      );

      return await response.json();
    },

    async createCustomLightningAddress(
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
            Authorization: `Bearer ${this.getApiKey()}`,
          },
          body: JSON.stringify({
            handle: handle,
            domain: domain,
            metadata: metadata,
          }),
        }
      );

      return await response.json();
    },

    async createLightningInvoice(
      amount: number,
      currency: Currency,
      memo: string,
      expirySeconds: number,
      metadata: Metadata | null
    ): Promise<LightningInvoice> {
      const response = await fetch(
        `${this.getHost()}/v1/bitcoin/deposit/lightning-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
          body: JSON.stringify({
            amount: amount,
            currency: currency,
            description: memo,
            expiry_seconds: expirySeconds,
            metadata: metadata,
          }),
        }
      );

      return new LightningInvoice(this, await response.json());
    },

    async getLightningInvoice(
      invoiceId: string
    ): Promise<CreateLightningInvoiceResponse> {
      const response = await fetch(
        `${this.getHost()}/v1/bitcoin/deposit/lightning-invoice/id/${invoiceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }
      );

      return await response.json();
    },

    async getBalance(): Promise<number> {
      const response = await fetch(
        `${this.getHost()}/v1/transactions/balance`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }
      );

      const data = await response.json();
      return data.data.balance;
    },

    async getTransactions(): Promise<GetTransactionsResponse> {
      const response = await fetch(`${this.getHost()}/v1/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getApiKey()}`,
        },
      });

      return await response.json();
    },
  };
}
