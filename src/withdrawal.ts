import { BitvoraClient } from "./bitvora_client";
import { BitcoinWithdrawalResponse, LightningPayment } from "./types";

export class Withdrawal {
  public id: string;
  public company_id: string;
  public ledger_tx_id: string;
  public amount_sats: number;
  public recipient: string;
  public network_type: string;
  public rail_type: string;
  public status: string;
  public lightning_payment: LightningPayment | null;
  public chain_tx_id: string | null;
  public metadata: any | null;
  public created_at: string;
  public updated_at: string;

  constructor(private client: BitvoraClient, data: BitcoinWithdrawalResponse) {
    const withdrawalData = data.data;
    this.id = withdrawalData.id;
    this.company_id = withdrawalData.company_id;
    this.ledger_tx_id = withdrawalData.ledger_tx_id;
    this.amount_sats = withdrawalData.amount_sats;
    this.recipient = withdrawalData.recipient;
    this.network_type = withdrawalData.network_type;
    this.rail_type = withdrawalData.rail_type;
    this.status = withdrawalData.status;
    this.lightning_payment = withdrawalData.lightning_payment;
    this.chain_tx_id = withdrawalData.chain_tx_id;
    this.metadata = withdrawalData.metadata;
    this.created_at = withdrawalData.created_at;
    this.updated_at = withdrawalData.updated_at;
  }

  public async isSettled(
    maxDuration = 20000,
    checkInterval = 1000
  ): Promise<void> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const withdrawalStatus = await this.client.getWithdrawal(this.id);
          if (withdrawalStatus.data.status === "settled") {
            clearInterval(intervalId); // Stop checking
            Object.assign(this, withdrawalStatus.data);
            resolve();
          } else if (withdrawalStatus.data.status === "failed") {
            clearInterval(intervalId); // Stop checking
            Object.assign(this, withdrawalStatus.data);
            resolve();
          } else if (Date.now() - startTime >= maxDuration) {
            clearInterval(intervalId); // Stop checking
            Object.assign(this, withdrawalStatus.data);
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
