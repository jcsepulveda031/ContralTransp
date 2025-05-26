import { Router } from 'express';
import DescarTransporController from '../controllers/DescarTranspor.Controller';

const router = Router();

router.get('/', DescarTransporController.getTransportes);
router.get('/InfoCarga/:id', DescarTransporController.getInfoCarga);
router.post('/descargarCarga/:id/:zona_id', DescarTransporController.descargarCarga);
router.post('/FinishDescarga/:id', DescarTransporController.finalizarCarga);
router.get('/InfoID/:id', DescarTransporController.getInfoID);
router.get('/getAll/:id', DescarTransporController.getAll);
export default router;
