import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { getDiverHistoryTransporteById } from "./services/DriverHistory.service";
import { useParams, useNavigate } from "react-router-dom";
import { historialDriverTras } from "../../types/types";
import { FaArrowLeft, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import './styles/ShowInfoHistTransporte.css';

interface NotificationState {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    show: boolean;
    details?: string;
}

const ShowInfoHistTransporte: React.FC = () => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true); 
    const [formData, setFormData] = useState<historialDriverTras | null>(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        type: 'info',
        show: false
    });

    const showNotification = (message: string, type: NotificationState['type'] = 'info', details?: string) => {
        setNotification({
            message,
            type,
            show: true,
            details
        });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    const handleError = (error: any) => {
        let errorMessage = 'Error al cargar la información del transporte';
        let errorDetails = '';

        if (error.response) {
            // Error de respuesta del servidor
            errorMessage = error.response.data?.message || errorMessage;
            errorDetails = `Código: ${error.response.status}`;
        } else if (error.request) {
            // Error de red
            errorMessage = 'Error de conexión';
            errorDetails = 'No se pudo conectar con el servidor';
        } else {
            // Otros errores
            errorDetails = error.message || 'Error desconocido';
        }

        showNotification(errorMessage, 'error', errorDetails);
    };

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        fetchDriverHistori();
    }, []);

    const fetchDriverHistori = async () => {
        if (!id) {
            showNotification('ID de transporte no proporcionado', 'error', 'Por favor, verifique la URL');
            return;
        }
        
        try {   
            const response = await getDiverHistoryTransporteById(Number(id));
            if (response.status === "OK" && response.data && response.data.length > 0) {
                setFormData(response.data[0]);
                showNotification('Información cargada exitosamente', 'success');
            } else {
                showNotification(
                    'No se encontró información del transporte',
                    'warning',
                    'El registro solicitado no existe o ha sido eliminado'
                );
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

    const NotificationDisplay: React.FC<{ notification: NotificationState }> = ({ notification }) => {
        if (!notification.show) return null;

        const getIcon = () => {
            switch (notification.type) {
                case 'error':
                    return <FaExclamationTriangle />;
                case 'success':
                    return <FaCheckCircle />;
                case 'warning':
                    return <FaExclamationTriangle />;
                default:
                    return <FaInfoCircle />;
            }
        };

        return (
            <div className={`notification ${notification.type}`}>
                <div className="notification-content">
                    <span className="notification-icon">{getIcon()}</span>
                    <div className="notification-text">
                        <div className="notification-message">{notification.message}</div>
                        {notification.details && (
                            <div className="notification-details">{notification.details}</div>
                        )}
                    </div>
                </div>
                <button 
                    className="notification-close"
                    onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                >
                    ×
                </button>
            </div>
        );
    };

    const LoadingSpinner = () => (
        <div className="loading">
            <FaSpinner className="spinner-icon" />
            <p>Cargando información...</p>
        </div>
    );

    const renderProcesos = () => { 
        if (loading) {
            return <LoadingSpinner />;
        }

        if (!formData) {
            return (
                <div className="error-message">
                    <FaExclamationTriangle className="error-icon" />
                    <h3>No hay datos disponibles</h3>
                    <p>No se encontró información para el transporte solicitado</p>
                    <button 
                        className="back-button"
                        onClick={() => navigate('/Contaltransp/Historial_Transprotes')}
                    >
                        <FaArrowLeft /> Volver al historial
                    </button>
                </div>
            );
        }

        return (
            <div className="transport-details-container">
                <NotificationDisplay notification={notification} />
                <div className="header-actions">
                    <button 
                        className="back-button"
                        onClick={() => navigate('/Contaltransp/Historial_Transprotes')}
                    >
                        <FaArrowLeft /> Volver
                    </button>
                    <h1>Detalles del Transporte</h1>
                </div>

                <div className="details-grid">
                    <div className="detail-section">
                        <h2>Información General</h2>
                        <div className="detail-item">
                            <label>Identificador:</label>
                            <span>{formData.identificador}</span>
                        </div>
                        <div className="detail-item">
                            <label>Estado:</label>
                            <span className={`status-badge ${formData.estado}`}>{formData.estado}</span>
                        </div>
                        <div className="detail-item">
                            <label>Fecha de Creación:</label>
                            <span>{formData.fecha_creacion}</span>
                        </div>
                        <div className="detail-item">
                            <label>Última Actualización:</label>
                            <span>{formData.fecha_actualizacion}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2>Información del Recorrido</h2>
                        <div className="detail-item">
                            <label>Almacén Origen:</label>
                            <span>{formData.almacen_origen_nombre}</span>
                        </div>
                        <div className="detail-item">
                            <label>Dirección Origen:</label>
                            <span>{formData.almacen_origen_direccion}</span>
                        </div>
                        <div className="detail-item">
                            <label>Almacén Destino:</label>
                            <span>{formData.almacen_destino_nombre}</span>
                        </div>
                        <div className="detail-item">
                            <label>Dirección Destino:</label>
                            <span>{formData.almacen_destino_direccion}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2>Información del Vehículo</h2>
                        <div className="detail-item">
                            <label>Placa:</label>
                            <span>{formData.vehiculo_placa}</span>
                        </div>
                        <div className="detail-item">
                            <label>Marca:</label>
                            <span>{formData.vehiculo_marca}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2>Tiempos del Recorrido</h2>
                        <div className="detail-item">
                            <label>Fecha Inicio:</label>
                            <span>{formData.fecha_inicio}</span>
                        </div>
                        <div className="detail-item">
                            <label>Fecha Fin:</label>
                            <span>{formData.fecha_fin || 'No finalizado'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Tiempo Recorrido:</label>
                            <span>{formData.tiempo_recorrido_horas || 'No disponible'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Tiempo Recomendado:</label>
                            <span>{formData.tiempo_recomendado_horas || 'No disponible'}</span>
                        </div>
                    </div>

                    {formData.observaciones && (
                        <div className="detail-section full-width">
                            <h2>Observaciones</h2>
                            <div className="observations-content">
                                {formData.observaciones}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>
                <div className="container">
                    {renderProcesos()} 
                </div>
            </div>
        </div>
    );
}

export default ShowInfoHistTransporte; 