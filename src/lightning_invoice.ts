import { BitvoraClient } from "./bitvora_client";
import {
  BitcoinWithdrawalResponse,
  CreateLightningInvoiceResponse,
  LightningPayment,
} from "./types";

export class LightningInvoice {
  public id: string;
  public company_id: string;
  public memo: string;
  public preimage: string;
  public rhash: string;
  public value: number;
  public is_settled: boolean;
  public settle_date: string;
  public payment_request: string;
  public description_hash: string;
  public expiry: string;
  public state: string;
  public metadata: any;
  public lightning_address_id: string | null;

  constructor(
    private client: BitvoraClient,
    data: CreateLightningInvoiceResponse
  ) {
    const lightningInvoiceData = data.data;
    this.id = lightningInvoiceData.id;
    this.company_id = lightningInvoiceData.company_id;
    this.memo = lightningInvoiceData.memo;
    this.preimage = lightningInvoiceData.r_preimage;
    this.rhash = lightningInvoiceData.r_hash;
    this.value = lightningInvoiceData.value;
    this.is_settled = lightningInvoiceData.settled;
    this.settle_date = lightningInvoiceData.settle_date;
    this.payment_request = lightningInvoiceData.payment_request;
    this.description_hash = lightningInvoiceData.description_hash;
    this.expiry = lightningInvoiceData.expiry;
    this.state = lightningInvoiceData.state;
    this.metadata = lightningInvoiceData.metadata;
    this.lightning_address_id = lightningInvoiceData.lightning_address_id;
  }

  public async isSettled(
    maxDuration = 2000000,
    checkInterval = 1000
  ): Promise<void> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const invoiceStatus = await this.client.getLightningInvoice(this.id);
          if (invoiceStatus.data.settled === true) {
            clearInterval(intervalId); // Stop checking
            Object.assign(this, invoiceStatus.data);
            resolve();
          } else if (Date.now() - startTime >= maxDuration) {
            clearInterval(intervalId); // Stop checking
            Object.assign(this, invoiceStatus.data);
            resolve();
          }
        } catch (error) {
          clearInterval(intervalId); // Stop checking on error
          reject(error);
        }
      }, checkInterval);
    });
  }
}
