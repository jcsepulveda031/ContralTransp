import { Router } from 'express';
import AdministarAlmanceController from '../controllers/admAlmacen.Controller';

const router = Router();


router.get('/', AdministarAlmanceController.getAll);
router.get('/search', AdministarAlmanceController.searchByName);
router.get('/show', AdministarAlmanceController.showFinalId);
router.post('/', AdministarAlmanceController.add);
router.put('/:id', AdministarAlmanceController.update);
router.delete('/:id', AdministarAlmanceController.delete);  
router.get('/ubicaciones/:almacenId', AdministarAlmanceController.getUbicaciones);
router.post('/ubicaciones', AdministarAlmanceController.postUbicacion);
router.put('/ubicaciones/:id', AdministarAlmanceController.putUbicacion);   
router.delete('/ubicaciones/:id', AdministarAlmanceController.deleteUbicacion);
router.get('/usuarios/:almacenId', AdministarAlmanceController.getUsuarios);
router.post('/usuarios/:almacenId', AdministarAlmanceController.addUsuarioAlmacen);
router.get('/usuarios', AdministarAlmanceController.getUsuariosDisponibles);
router.delete('/usuarios/:userId', AdministarAlmanceController.removeUsuarioAlmacen);

export default router;
