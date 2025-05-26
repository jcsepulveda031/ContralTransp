import { Router } from 'express';
import UserController from '../controllers/User.Controller';

const router = Router();

router.get('/:id', UserController.getUserInfo);
router.put('/', UserController.updateUserInfo);
router.put('/change-password/:id', UserController.changePassword);
router.put('/change-photo/:id', UserController.changePhoto);

export default router;