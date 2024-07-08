export interface Metadata {
  [key: string]: string;
}

export interface DepositChainConfirmedPayload {
  deposit_id: string;
  chain_txid: string;
  chain_deposit_address: string;
  amount_sats: number;
  fee: number;
  metadata: Metadata;
}

export interface WebhookPayloads {
  deposit_chain_confirmed: DepositChainConfirmedPayload;
  // Add other event types here
}

export interface WebhookEvent<T> {
  event_type: keyof WebhookPayloads;
  data: T;
}
