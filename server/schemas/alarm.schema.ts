```typescript
import { z } from 'zod';

const alarmConditionSchema = z.object({
  type: z.enum(['transit_time', 'status_duration', 'description_match', 'delivery_date']),
  params: z.object({
    maxDays: z.number().optional(),
    status: z.string().optional(),
    durationHours: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    latestDeliveryDate: z.string().optional()
  })
});

export const createAlarmSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Alarm name is required'),
    scope: z.enum(['global', 'specific']),
    trackingNumber: z.string().optional(),
    conditions: z.array(alarmConditionSchema).min(1, 'At least one condition is required'),
    notifyEmail: z.string().email('Invalid email format')
  })
});

export const updateAlarmSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Alarm name is required'),
    active: z.boolean(),
    notifyEmail: z.string().email('Invalid email format'),
    conditions: z.array(alarmConditionSchema).min(1, 'At least one condition is required')
  })
});
```