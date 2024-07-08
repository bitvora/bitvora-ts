# Bitvora SDK

A Node.js SDK for receiving and validating Bitvora webhooks.

## Installation

```bash
npm install bitvora
```

## Express Example

```typescript
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {
  Webhook,
  WebhookEvent,
  DepositChainConfirmedPayload,
  AnotherEventPayload,
} from "./types";

const app = express();
const port = 3000;

const clientSecret = "your_client_secret"; // Replace with your actual client secret
const webhook = new Webhook(clientSecret);

app.use(bodyParser.json());

app.post("/bitvora_webhook", (req: Request, res: Response) => {
  const signature = req.headers["bitvora-hash"] as string;
  const body = req.body as WebhookEvent;

  if (!signature || !body) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const payload = JSON.stringify(body);
  const isValid = webhook.validateSignature(payload, signature);

  if (!isValid) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  // Use TypeScript's type narrowing
  switch (body.event_type) {
    case "deposit_chain_confirmed":
      handleDepositChainConfirmed(body.data);
      break;
    case "another_event":
      handleAnotherEvent(body.data);
      break;
    // Add cases for other event types
    default:
      return res.status(400).json({ error: "Unhandled event type" });
  }

  return res.status(200).json({ status: "success" });
});

function handleDepositChainConfirmed(data: DepositChainConfirmedPayload) {
  // Handle deposit_chain_confirmed event
  console.log("Deposit confirmed:", data);
}

function handleAnotherEvent(data: AnotherEventPayload) {
  // Handle another_event
  console.log("Another event:", data);
}

// Add other event handlers here

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

## NestJS Example

```typescript
import {
  Controller,
  Post,
  Headers,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  Webhook,
  WebhookEvent,
  DepositChainConfirmedPayload,
  AnotherEventPayload,
} from "bitvora"; // Adjust the import according to your SDK setup

@Controller("bitvora_webhook")
export class BitvoraController {
  private readonly clientSecret = "your_client_secret"; // Replace with your actual client secret
  private readonly webhook: Webhook;

  constructor() {
    this.webhook = new Webhook(this.clientSecret);
  }

  @Post()
  handleWebhook(
    @Headers("bitvora-hash") signature: string,
    @Body() body: WebhookEvent
  ): any {
    const payload = JSON.stringify(body);
    const isValid = this.webhook.validateSignature(payload, signature);

    if (!isValid) {
      throw new HttpException("Invalid signature", HttpStatus.FORBIDDEN);
    }

    switch (body.event_type) {
      case "deposit_chain_confirmed":
        this.handleDepositChainConfirmed(body.data);
        break;
      case "another_event":
        this.handleAnotherEvent(body.data);
        break;
      // Add cases for other event types
      default:
        throw new HttpException("Unhandled event type", HttpStatus.BAD_REQUEST);
    }

    return { status: "success" };
  }

  private handleDepositChainConfirmed(data: DepositChainConfirmedPayload) {
    // Handle deposit_chain_confirmed event
    console.log("Deposit confirmed:", data);
  }

  private handleAnotherEvent(data: AnotherEventPayload) {
    // Handle another_event
    console.log("Another event:", data);
  }

  // Add other event handlers here
}
```
