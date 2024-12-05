import axios from 'axios';
import { webhookConfigSchema, WebhookConfig, WebhookPayload } from './types';
import { WebhookSecurity } from './security';
import { Shipment } from '../../types/shipment';

export class WebhookService {
  private config: WebhookConfig;
  private security: WebhookSecurity;

  constructor(config: WebhookConfig) {
    this.initializeService(config);
  }

  private initializeService(config: WebhookConfig): void {
    try {
      this.config = webhookConfigSchema.parse(config);
      this.security = new WebhookSecurity(this.config.secret);
    } catch (error) {
      throw new Error('Invalid webhook configuration');
    }
  }

  private createPayload(event: string, shipment: Shipment): WebhookPayload {
    return {
      event,
      timestamp: new Date().toISOString(),
      shipment,
    };
  }

  async sendWebhook(event: string, shipment: Shipment): Promise<void> {
    const payload = this.createPayload(event, shipment);
    const payloadString = JSON.stringify(payload);
    const signature = this.security.generateSignature(payloadString);

    const headers = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    };

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        await axios.post(this.config.url, payloadString, { headers });
        return;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.retries) {
          await this.delay(attempt);
        }
      }
    }

    throw new Error(`Failed to send webhook after ${this.config.retries} attempts: ${lastError?.message}`);
  }

  private delay(attempt: number): Promise<void> {
    const backoffMs = 2000 * Math.pow(2, attempt);
    return new Promise(resolve => setTimeout(resolve, backoffMs));
  }
}