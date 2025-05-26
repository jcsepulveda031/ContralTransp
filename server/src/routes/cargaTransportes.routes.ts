import { Router } from 'express';
import CargaTransportes from '../controllers/cargaTrans.controller';

const router = Router();

router.get('/', CargaTransportes.getAll);
router.get('/:id', CargaTransportes.getById);
router.post('/:id', CargaTransportes.finishCarga);

export default router;