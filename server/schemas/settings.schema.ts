```typescript
import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    notificationPreferences: z.object({
      email: z.boolean(),
      daily_summary: z.boolean()
    }),
    webhookUrl: z.string().url().optional().nullable()
  })
});
```