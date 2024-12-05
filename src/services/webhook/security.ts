import crypto from 'crypto';

export class WebhookSecurity {
  constructor(private readonly secret: string) {}

  generateSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');
  }
}