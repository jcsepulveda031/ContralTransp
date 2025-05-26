import { Router } from 'express';
import UserInfoController from '../controllers/UserInfo.controller';

const router = Router();

router.get('/', UserInfoController.getUserInfo);
router.post('/:id',UserInfoController.posUserRoleInfo);

export default router;