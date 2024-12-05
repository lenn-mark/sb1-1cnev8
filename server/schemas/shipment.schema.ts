import { z } from 'zod';

export const createShipmentSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(1, 'Tracking number is required'),
    carrierId: z.string().min(1, 'Carrier ID is required'),
    order: z.object({
      orderId: z.string(),
      platform: z.object({
        id: z.string(),
        name: z.string()
      }),
      origin: z.object({
        city: z.string(),
        country: z.string()
      }),
      destination: z.object({
        city: z.string(),
        country: z.string()
      }),
      buyer: z.object({
        name: z.string(),
        phoneNumber: z.string().optional(),
        address: z.object({
          line1: z.string(),
          line2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string()
        })
      })
    })
  })
});