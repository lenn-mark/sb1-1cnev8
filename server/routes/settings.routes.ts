```typescript
import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { updateSettingsSchema } from '../schemas/settings.schema';

const router = Router();
const settingsController = new SettingsController();

router.use(authenticate);

router.get('/', settingsController.getSettings);
router.put('/', validateRequest(updateSettingsSchema), settingsController.updateSettings);
router.post('/api-key', settingsController.updateApiKey);

export default router;
```