import { Router } from 'express';
import Authentication from '../controllers/auth.Controller';

const router = Router();

router.post('/registro', Authentication.register);
router.post('/login', Authentication.Login);
router.post('/forgot-password', Authentication.forgotPassword);
router.post('/verify-reset-code', Authentication.verifyResetCode);
router.post('/reset-password', Authentication.resetPassword);
router.post('/resend-reset-code', Authentication.resendResetCode);

export default router;