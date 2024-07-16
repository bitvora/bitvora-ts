export interface Metadata {
  [key: string]: string;
}

export interface DepositOnChainPayload {
  deposit_id: string;
  chain_txid: string;
  chain_deposit_address: string;
  amount_sats: number;
  fee: number;
  status: "pending" | "settled" | "failed";
  metadata: Metadata;
}

export interface WithdrawalOnChainPayload {
  withdrawal_id: string;
  chain_txid: string;
  chain_withdrawal_address: string;
  amount_sats: number;
  fee: number;
  status: "pending" | "settled" | "failed";
  metadata: Metadata;
}

export interface WithdrawalLightningPayload {
  withdrawal_id: string;
  recipient: string;
  status: "pending" | "settled" | "failed";
  amount_sats: number;
  payment_route: {
    hops: Array<{
      amt_to: string;
      expiry: number;
      chan_id: string;
      chan_capacity: string;
      amt_to_forward: string;
    }>;
  };
  payment_preimage: string;
  metadata: Metadata;
}

export interface DepositLightningPayload {
  deposit_id: string;
  sender: string;
  status: "pending" | "settled" | "failed";
  amount_sats: number;
  payment_request: string;
  description_hash: string;
  expiry_seconds: number;
  payment_preimage: string;
  r_hash: string;
  metadata: Metadata;
}

export interface WebhookPayloads {
  deposit_chain_pending: DepositOnChainPayload;
  deposit_chain_completed: DepositOnChainPayload;
  withdrawal_chain_pending: WithdrawalOnChainPayload;
  withdrawal_chain_completed: WithdrawalOnChainPayload;
  withdrawal_lightning_pending: WithdrawalLightningPayload;
  withdrawal_lightning_completed: WithdrawalLightningPayload;
  deposit_lightning_completed: DepositLightningPayload;
}

export interface DepositOnChainCompletedEvent {
  event_type: "deposit.onchain.completed";
  data: DepositOnChainPayload;
}

export interface DepositOnChainPendingEvent {
  event_type: "deposit.onchain.pending";
  data: DepositOnChainPayload;
}

export interface DepositLightningCompletedEvent {
  event_type: "deposit.lightning.completed";
  data: DepositLightningPayload;
}

export interface WithdrawalChainPendingEvent {
  event_type: "withdrawal.chain.pending";
  data: WithdrawalOnChainPayload;
}

export interface WithdrawalChainCompletedEvent {
  event_type: "withdrawal.chain.completed";
  data: WithdrawalOnChainPayload;
}

export interface WithdrawalLightningPendingEvent {
  event_type: "withdrawal.lightning.pending";
  data: WithdrawalLightningPayload;
}

export interface WithdrawalLightningCompletedEvent {
  event_type: "withdrawal.lightning.completed";
  data: WithdrawalLightningPayload;
}

export type WebhookEvent =
  | DepositOnChainCompletedEvent
  | DepositOnChainPendingEvent
  | DepositLightningCompletedEvent
  | WithdrawalChainPendingEvent
  | WithdrawalChainCompletedEvent
  | WithdrawalLightningPendingEvent
  | WithdrawalLightningCompletedEvent;

export interface BitcoinWithdrawalResponse {
  status: number;
  message: string;
  data: BitcoinWithdrawal;
}

export interface BitcoinWithdrawal {
  id: string;
  company_id: string;
  ledger_tx_id: string;
  amount_sats: number;
  recipient: string;
  network_type: string;
  rail_type: string;
  status: string;
  lightning_payment: LightningPayment | null;
  metadata: string | null;
  chain_tx_id: null;
  created_at: string;
  updated_at: string;
}

export interface LightningAddress {
  id: string;
  company_id: string;
  handle: string | null;
  domain: string | null;
  address: string;
  metadata: Metadata;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
  deleted_at: string | null;
}

export interface CreateLightningAddressResponse {
  status: number;
  message: string;
  data: LightningAddress;
}

export interface LightningInvoice {
  id: string;
  company_id: string;
  node_id: string;
  memo: string;
  r_preimage: string;
  r_hash: string;
  value: number;
  settled: boolean;
  creation_date: string;
  settle_date: string;
  payment_request: string;
  description_hash: string;
  expiry: string;
  state: string;
  metadata: Metadata;
  lightning_address_id: string | null;
}

export interface CreateLightningInvoiceResponse {
  status: number;
  message: string;
  data: LightningInvoice;
}

export interface BitcoinDeposit {
  id: string;
  company_id: string;
  ledger_tx_id: string;
  recipient: string;
  amount_sats: number;
  network_type: string;
  rail_type: string;
  status: string;
  chain_tx_id: string | null;
  lightning_invoice_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BitcoinDepositResponse {
  status: number;
  message: string;
  data: BitcoinDeposit;
}

export interface LightningPayment {
  node_id: string;
  response: {
    payment_error: string;
    payment_preimage: string;
    payment_route: {
      total_time_lock: number;
      total_fees: string;
      total_amt: string;
      hops: {
        chan_id: string;
        chan_capacity: string;
        amt_to_forward: string;
        expiry: number;
        amt_to: string;
      }[];
    };
    payment_hash: string;
  };
}
