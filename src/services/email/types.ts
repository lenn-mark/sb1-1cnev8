import { z } from 'zod';

export const emailConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  secure: z.boolean(),
  auth: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

export interface ShipmentUpdateData {
  trackingNumber: string;
  status: string;
  location: string;
  timestamp: Date;
}

export interface DeliveryConfirmationData {
  trackingNumber: string;
  deliveryLocation: string;
  deliveryTime: Date;
}