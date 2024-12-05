import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createTagSchema } from '../schemas/tag.schema';

const router = Router();
const tagController = new TagController();

router.use(authenticate);

router.get('/', tagController.getTags);
router.post('/', validateRequest(createTagSchema), tagController.createTag);
router.get('/shipment/:shipmentId', tagController.getShipmentTags);
router.post('/shipment/:shipmentId/:tagId', tagController.addTagToShipment);
router.delete('/shipment/:shipmentId/:tagId', tagController.removeTagFromShipment);

export default router;