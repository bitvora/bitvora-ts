export declare class BitvoraClient {
    private apiKey;
    private network;
    constructor(apiKey: string, network: string);
    getApiKey(): string;
    getNetwork(): string;
    isValidNetwork(): boolean;
    getHost(): string;
    validateWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
//# sourceMappingURL=bitvora_client.d.ts.map