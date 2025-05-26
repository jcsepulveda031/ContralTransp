import express from 'express';
import AdmConductorController from '../controllers/admConductor.Controller';

const router = express.Router();

router.get('/', AdmConductorController.getAll);
router.post('/', AdmConductorController.add);
router.post('/crear-usuario', AdmConductorController.crearUsuarioDriver);
router.get('/obtener-usuario/:user_id', AdmConductorController.getUserForConductor);
router.put('/:cedula', AdmConductorController.update);
router.delete('/:id', AdmConductorController.deleteConductor);

export default router;