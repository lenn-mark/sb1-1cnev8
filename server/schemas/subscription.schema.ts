```typescript
import { z } from 'zod';

export const upgradePlanSchema = z.object({
  body: z.object({
    plan: z.enum(['basic', 'starter', 'professional', 'business', 'enterprise'])
  })
});
```