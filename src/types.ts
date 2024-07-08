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

// Define other event payload types here
export interface AnotherEventPayload {
  // Define the payload structure
}

export interface WebhookPayloads {
  deposit_chain_confirmed: DepositChainConfirmedPayload;
  another_event: AnotherEventPayload;
}

export interface DepositChainConfirmedEvent {
  event_type: "deposit_chain_confirmed";
  data: DepositChainConfirmedPayload;
}

export interface AnotherEvent {
  event_type: "another_event";
  data: AnotherEventPayload;
}

// Define other event types here

export type WebhookEvent = DepositChainConfirmedEvent | AnotherEvent;
