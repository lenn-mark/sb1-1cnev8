```typescript
import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upgradePlanSchema } from '../schemas/subscription.schema';

const router = Router();
const subscriptionController = new SubscriptionController();

router.use(authenticate);

router.get('/', subscriptionController.getSubscriptionDetails);
router.get('/billing-history', subscriptionController.getBillingHistory);
router.post('/upgrade', validateRequest(upgradePlanSchema), subscriptionController.upgradePlan);
router.post('/cancel', subscriptionController.cancelSubscription);

export default router;
```