import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles/register.css';
import { fecthRegister } from './services/register.service';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';

const RegisterContent: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        age: "",
        role: "",
        phone: ""
    });

    const [errorResponse, setErrorResponse] = useState({
        message: "",
        field: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

        if (!formData.email.trim()) {
            showNotification('error', 'El email es requerido');
            setErrorResponse({ message: "El email es requerido", field: "email" });
            setIsLoading(false);
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showNotification('error', 'Formato de email inválido');
            setErrorResponse({ message: "Formato de email inválido", field: "email" });
            setIsLoading(false);
            return;
        }

        if (!formData.password) {
            showNotification('error', 'La contraseña es requerida');
            setErrorResponse({ message: "La contraseña es requerida", field: "password" });
            setIsLoading(false);
            return;
        } else if (formData.password.length < 8) {
            showNotification('error', 'La contraseña debe tener al menos 8 caracteres');
            setIsLoading(false);
            return;
        }

        if (!formData.role) {
            showNotification('error', 'Debe seleccionar un rol');
            setErrorResponse({ message: "Debe seleccionar un rol", field: "role" });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fecthRegister(formData);

            if (response.data.status === 200 || response.data.status === 201) {
                showNotification('success', 'Registro exitoso');
                navigate('/login');
            } else {
                showNotification('error', response.data.message || 'Error en el registro');
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification('error', error instanceof Error ? error.message : "Error desconocido");
            setErrorResponse({
                message: error instanceof Error ? error.message : "Error desconocido",
                field: "username",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>Crear cuenta</h1>
                
                {errorResponse.message && (
                    <div className={`error-message ${!errorResponse.field ? 'general-error' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <span>{errorResponse.message}</span>
                    </div>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={handleChange}
                    className={errorResponse.field === "username" ? "error-field" : ""}
                    required
                />
                
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errorResponse.field === "email" ? "error-field" : ""}
                    required
                />
                
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                
                <input
                    type="number"
                    name="age"
                    placeholder="Edad"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    required
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={errorResponse.field === "role" ? "error-field" : ""}
                    required
                >
                    <option value="">Roles disponibles</option>
                    <option value="User">Usuario</option>
                </select>

                <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={errorResponse.field === "password" ? "error-field" : ""}
                    required
                />
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Crear cuenta'}
                </button>
                <div className="login-links">
                    <p>¿Ya tienes una cuenta? - <Link to="/">Iniciar Sesión</Link></p>
                </div>
            </form>
        </div>
    );
};

const Register: React.FC = () => {
    return (
        <NotificationProvider>
            <RegisterContent />
        </NotificationProvider>
    );
};

export default Register;