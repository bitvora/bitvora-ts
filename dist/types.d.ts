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
export type WebhookEvent = DepositOnChainCompletedEvent | DepositOnChainPendingEvent | DepositLightningCompletedEvent | WithdrawalChainPendingEvent | WithdrawalChainCompletedEvent | WithdrawalLightningPendingEvent | WithdrawalLightningCompletedEvent;
//# sourceMappingURL=types.d.ts.map