import { Router } from 'express';
import AsignarCarga from '../controllers/asignarCarga.controller'; 

const router = Router();

router.get('/', AsignarCarga.getAll);
router.get('/:id', AsignarCarga.getById);
router.get('/detalle/:id', AsignarCarga.getDetalleCarga);
router.post('/', AsignarCarga.postAsignarInfoContr);

router.put('/:id', AsignarCarga.update);
router.delete('/del/details/:id', AsignarCarga.delete);
router.delete('/del/zona/:id', AsignarCarga.deleteZona);
export default router;