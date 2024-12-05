```typescript
import { Router } from 'express';
import { AlarmController } from '../controllers/alarm.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createAlarmSchema, updateAlarmSchema } from '../schemas/alarm.schema';

const router = Router();
const alarmController = new AlarmController();

router.use(authenticate);

router.get('/', alarmController.getAlarms);
router.post('/', validateRequest(createAlarmSchema), alarmController.createAlarm);
router.put('/:id', validateRequest(updateAlarmSchema), alarmController.updateAlarm);
router.get('/triggered', alarmController.getTriggeredShipments);
router.delete('/triggered/:alarmId/:shipmentId', alarmController.removeTriggeredShipment);

export default router;
```