import { z } from 'zod';

export const apiKeySchema = z.string().min(32);

export interface APIHeaders {
  Authorization: string;
  'Content-Type': string;
}

export interface ShipmentResponse {
  trackingNumber: string;
  status: string;
  events: Array<{
    status: string;
    timestamp: string;
    location: string;
  }>;
}

export interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}