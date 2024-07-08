# Bitvora SDK

A Node.js SDK for receiving and validating Bitvora webhooks.

## Installation

```bash
npm install bitvora
```

```typescript
import { Webhook, WebhookEvent, WebhookPayloads } from 'bitvora';

const clientSecret = 'your_client_secret';
const webhook = new Webhook(clientSecret);

// Example webhook payload
const event: WebhookEvent<WebhookPayloads['deposit_chain_confirmed']> = {
    event_type: 'deposit_chain_confirmed',
    data: {
        deposit_id: 'd1b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
        chain_txid: 'n7092873405v9273v4095n7v02934nv752v3n4v5n7v',
        chain_deposit_address: 'bcq1asdfn0a7s9dfas9dfn9as7',
        amount_sats: 100000,
        fee: 1000,
        metadata: {
            key1: 'value1',
            key2': 'value2'
        }
    }
};

// Example header
const signature = 'sha256/hmac hash of payload with client secret';

const result = webhook.processWebhook(event, signature);

if (result) {
    console.log('Webhook is valid:', result);
} else {
    console.log('Invalid webhook signature');
}
```
