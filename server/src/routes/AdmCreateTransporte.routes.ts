import { Router } from 'express';
import TransporteController from '../controllers/AdmCreateTransporte.controller';

const router = Router();

router.get('/', TransporteController.getAll);
router.get('/:id', TransporteController.getById);
router.get('/search/show', TransporteController.showFinalTransp);

router.post('/', TransporteController.create);
router.put('/:id', TransporteController.update);
router.delete('/:id', TransporteController.delete);

//Search
router.get('/search/Cond/:cedula', TransporteController.getSearchConductor);
router.get('/search/Alm/:codigo', TransporteController.getSearchAlmacen);
router.get('/search/Vehi/:placa', TransporteController.getSearchVehiculo);
router.get('/search/tra/:codigo', TransporteController.getSerchtransporte);

export default router;