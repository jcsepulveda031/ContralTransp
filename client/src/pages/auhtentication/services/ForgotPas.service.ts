import api from '../../../services/api';

export const postForgotPassword = async (email: string) => {
    // El backend espera { email: ... }
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const postVerifyResetCode = async (email: string, code: string) => {
    const response = await api.post('/auth/verify-reset-code', { email, code });
    return response.data;
};

export const postResetPassword = async (token: string, newPassword: string, confirmPassword: string, email: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword, confirmPassword,email });
    return response.data;
};

// Servicio para reenviar el código de verificación (si el backend lo implementa)
export const postResendResetCode = async (email: string) => {
    const response = await api.post('/auth/resend-reset-code', { email });
    return response.data;
};