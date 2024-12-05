import axios from 'axios';
import { z } from 'zod';
import { Shipment } from '../types/shipment';

const webhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(32),
  retries: z.number().min(0).max(5).default(3),
});

export class WebhookService {
  private config: z.infer<typeof webhookConfigSchema>;

  constructor(config: z.infer<typeof webhookConfigSchema>) {
    try {
      this.config = webhookConfigSchema.parse(config);
    } catch (error) {
      throw new Error('Invalid webhook configuration');
    }
  }

  private generateSignature(payload: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', this.config.secret)
      .update(payload)
      .digest('hex');
  }

  async sendWebhook(event: string, shipment: Shipment) {
    const payload = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      shipment,
    });

    const signature = this.generateSignature(payload);

    const headers = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    };

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        await axios.post(this.config.url, payload, { headers });
        return;
      } catch (error) {
        lastError = error;
        if (attempt < this.config.retries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, attempt)));
        }
      }
    }

    throw new Error(`Failed to send webhook after ${this.config.retries} attempts: ${lastError?.message}`);
  }
}