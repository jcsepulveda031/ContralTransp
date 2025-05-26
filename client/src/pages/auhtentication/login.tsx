import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles/login.css';
import { postLogin } from './services/login.service';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const LoginContent: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [errorResponse, setErrorResponse] = useState({
        message: "",
        field: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errorResponse.field === name) {
            setErrorResponse({ message: "", field: "" });
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrorResponse({ message: "", field: "" });

        if (!formData.username.trim()) {
            showNotification('error', 'El nombre de usuario es requerido');
            setErrorResponse({ message: "El nombre de usuario es requerido", field: "username" });
            setIsLoading(false);
            return;
        }

        if (!formData.password) {
            showNotification('error', 'La contraseña es requerida');
            setErrorResponse({ message: "La contraseña es requerida", field: "password" });
            setIsLoading(false);
            return;
        }

        try {
            const response = await postLogin(formData);
            if (response) {
                const { token, user } = response;
                login(token, user, 3600); // 3600 segundos = 1 hora
                showNotification('success', 'Inicio de sesión exitoso');
                navigate('/Contaltransp', { replace: true });
            } else {
                showNotification('error', 'Error en el inicio de sesión');
                setErrorResponse({
                    message: 'Error en el inicio de sesión',
                    field: "username"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification('error', error instanceof Error ? error.message : "Error desconocido");
          
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-main-container">
            <div className="login-main-box">
                <div className="login-welcome-section">
                    <h1>Bienvenido</h1>
                    <p>Ingresa tus credenciales para acceder al sistema</p>
                </div>
                <form className="login-form-section" onSubmit={handleSubmit}>
                    <h1>Iniciar Sesión</h1>
                    {errorResponse.message && (
                        <div className={`login-error-message${!errorResponse.field ? ' general-error' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                            <span>{errorResponse.message}</span>
                        </div>
                    )}
                    <div className="login-form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                            className={errorResponse.field === "username" ? "error-field" : ""}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={errorResponse.field === "password" ? "error-field" : ""}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                    </button>
                    <div className="login-form-links">
                        <Link to="/forgotpassword">¿Olvidaste tu contraseña?</Link>
                        <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Login: React.FC = () => {
    return (
        <NotificationProvider>
            <LoginContent />
        </NotificationProvider>
    );
};

export default Login;