import { z } from 'zod';
import { Shipment } from '../../types/shipment';

export const webhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(32),
  retries: z.number().min(0).max(5).default(3),
});

export type WebhookConfig = z.infer<typeof webhookConfigSchema>;

export interface WebhookPayload {
  event: string;
  timestamp: string;
  shipment: Shipment;
}