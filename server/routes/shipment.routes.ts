import { Router } from 'express';
import { ShipmentController } from '../controllers/shipment.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createShipmentSchema } from '../schemas/shipment.schema';

const router = Router();
const shipmentController = new ShipmentController();

router.use(authenticate);

router.get('/', shipmentController.getActiveShipments);
router.post('/', validateRequest(createShipmentSchema), shipmentController.createShipment);
router.get('/:id', shipmentController.getShipmentDetails);

export default router;