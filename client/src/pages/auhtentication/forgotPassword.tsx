import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles/ForgotPassword.css';
import { postForgotPassword, postVerifyResetCode, postResetPassword } from './services/ForgotPas.service';
import { useNotification } from '../../context/NotificationContext';


const ForgotPasswordFlow: React.FC = () => {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        const response = await postForgotPassword(email);
        if(response.status){ 
          setStep('code');
          showNotification('success', 'Código enviado al correo electrónico');
        }else{
          showNotification('error', response.message || 'Error al enviar el código');
        }
    } catch (err: any) {
        showNotification('error', err.response?.data?.message || 'Error al enviar el código');
    } finally {
        setLoading(false);
    }
  };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await postVerifyResetCode( email , code); 
            console.log(response)
            if(response.status){
                console.log('Prueba codigo correcto')
                //setResetToken(response.data.token);
                setStep('reset');
                console.log('Prueba codigo correcto')
                showNotification('success', 'Código verificado correctamente');
            }else{
                showNotification('error', response.message || 'Código inválido o expirado');
            }
        } catch (err: any) {
            showNotification('error', err.response?.data?.message || 'Código inválido o expirado');
        } finally {
            setLoading(false);
        }
    };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showNotification('error', 'Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 8) {
      showNotification('error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
        await postResetPassword( resetToken, newPassword, confirmPassword , email)
        showNotification('success', 'Contraseña actualizada correctamente');
        setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
        showNotification('error', err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      {step === 'email' && (
        <form className="forgot-form" onSubmit={handleSendCode}>
          <h1>Recuperar contraseña</h1>
          <p>Ingresa tu correo electrónico para recibir un código de verificación.</p>
          
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
          <p>¿Ya tienes una cuenta? - <Link to="/">Iniciar Sesión</Link></p>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      )}

      {step === 'code' && (
        <form className="forgot-form" onSubmit={handleVerifyCode}>
          <h1>Verificar Código</h1>
          <p>Hemos enviado un código de 6 dígitos a {email}. Por favor ingrésalo a continuación.</p>
          
          <input 
            type="text" 
            placeholder="Código de verificación" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required 
          />
          
          <button type="submit" disabled={loading} className="main-btn">
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
          <button
            type="button"
            className="resend-btn"
            disabled={loading || resendTimer > 0}
            onClick={async () => {
              setLoading(true);
              setError('');
              setSuccess('');
              try {
                const response = await postForgotPassword(email);
                if (response) {
                  showNotification('success', 'Nuevo código enviado al correo electrónico');
                  setResendTimer(60);
                } else {
                  showNotification('error', response.message || 'Error al reenviar el código');
                }
              } catch (err: any) {
                showNotification('error', err.response?.data?.message || 'Error al reenviar el código');
              } finally {
                setLoading(false);
              }
            }}
          >
            {resendTimer > 0 ? `Reenviar Código (${resendTimer}s)` : 'Reenviar Código'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form className="forgot-form" onSubmit={handleResetPassword}>
          <h1>Cambiar Contraseña</h1>
          <p>Ingresa tu nueva contraseña.</p>
          
          <input 
            type="password" 
            placeholder="Nueva contraseña" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Confirmar contraseña" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordFlow;