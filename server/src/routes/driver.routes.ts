import { Router } from 'express';
import driverController from '../controllers/driver.controller';

const router = Router();

router.get('/:id', driverController.getInfoDriver);
router.get('/History/:id',driverController.getHistoryDriver)
router.get('/History/show/:id',driverController.getHistoryDriverById)
router.post('/status/:id',driverController.postStatusDriver);
router.post('/detail/:id',driverController.postDetailDriver);
router.get('/detail/:id',driverController.getDetailDriver);

export default router;