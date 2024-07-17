# Bitvora SDK

A Node.js SDK written in Typescript for the Bitvora API and Webhooks.

## Installation

```bash
npm install bitvora
```

## Usage

### Sending Bitcoin (withdrawal)

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function sendBitcoin(): Promise<Withdrawal> {
  const withdrawal = await bitvora.withdraw(
    "utxo1@getalby.com", // accepts on-chain, lightning invoice (payment request), lightning address, lnurl
    25 // amount, in sats
  );

  await withdrawal.isSettled(); // wait until the payment succeeds or fails, optional

  return withdrawal;
}
```

### Creating a Lightning Address

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function createLightningAddress(): Promise<CreateLightningAddressResponse> {
  let metadata = {
    userID: "your-internal-user-id",
    email: "useremail@protonmail.com",
  }; // optional metadata object to attach, accepts any valid key-value object

  return bitvora.createLightningAddress(metadata); // also accepts null
}
```

### Create a Lightning Invoice

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function createLightningInvoice(): Promise<LightningInvoice> {
  let metadata = {
    userID: "your-internal-user-id",
    email: "useremail@protonmail.com",
  }; // optional metadata object to attach, accepts any valid key-value object

  const invoice = await bitvora.createLightningInvoice(
    50,
    "this is from the sdk",
    3600,
    metadata
  );

  await invoice.isSettled();

  return invoice;
}
```

### Get Balance

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function getBalance(): Promise<number> {
  return bitvora.getBalance();
}
```

### Get Transactions

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function getTransactions(): Promise<GetTransactionsResponse> {
  return bitvora.getTransactions();
}
```

### Get Deposit

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function getDeposit(): Promise<BitcoinDepositResponse> {
  return bitvora.getDeposit("UUID-HERE");
}
```

### Get Withdrawal

```typescript
import { BitvoraClient } from "bitvora";

const bitvora = new BitvoraClient(API_KEY, "mainnet"); // ["mainnet", "testnet", "signet"]

async function getWithdrawal(): Promise<BitcoinWithdrawalResponse> {
  return bitvora.getWithdrawal("UUID-HERE");
}
```
