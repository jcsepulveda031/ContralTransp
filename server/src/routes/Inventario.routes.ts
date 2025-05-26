import { Router } from 'express';
import InventarioController from '../controllers/Inventario.Controller';

const router = Router();

router.get('/:id', InventarioController.getPickingLocations);
router.get('/zonaCarga/:id', InventarioController.getZonaCarga);
router.post('/moveToLoadingZone', InventarioController.moveToLoadingZone);
router.post('/moveToPickingLocation', InventarioController.moveToPickingLocation);
router.post('/moveToPickingLocationZone', InventarioController.moveToPickingLocationZone);
router.post('/UbicationToUbication', InventarioController.postUbicationToUbication);

export default router;