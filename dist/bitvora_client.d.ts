import { BitcoinDepositResponse, BitcoinWithdrawalResponse, CreateLightningAddressResponse, CreateLightningInvoiceResponse, GetTransactionsResponse, Metadata } from "./types";
import { Withdrawal } from "./withdrawal";
import { LightningInvoice } from "./lightning_invoice";
export declare class BitvoraClient {
    private apiKey;
    private network;
    constructor(apiKey: string, network: string);
    getApiKey(): string;
    getNetwork(): string;
    isValidNetwork(): boolean;
    getHost(): string;
    validateWebhookSignature(payload: string, signature: string, secret: string): boolean;
    withdraw(destination: string, amount_sats: number): Promise<Withdrawal>;
    getWithdrawal(withdrawalId: string): Promise<BitcoinWithdrawalResponse>;
    getDeposit(depositId: string): Promise<BitcoinDepositResponse>;
    createLightningAddress(metadata: Metadata | null): Promise<CreateLightningAddressResponse>;
    createCustomLightningAddress(handle: string, domain: string, metadata: Metadata | null): Promise<any>;
    createLightningInvoice(amountSats: number, memo: string, expirySeconds: number, metadata: Metadata | null): Promise<LightningInvoice>;
    getLightningInvoice(invoiceId: string): Promise<CreateLightningInvoiceResponse>;
    getBalance(): Promise<number>;
    getTransactions(): Promise<GetTransactionsResponse>;
}
//# sourceMappingURL=bitvora_client.d.ts.map