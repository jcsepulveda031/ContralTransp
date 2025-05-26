import { Router } from 'express';
import HistorialTransporteController from '../controllers/HistorialTransporte.controller';

const router = Router();

router.get('/', HistorialTransporteController.getHistorial);1

export default router;
