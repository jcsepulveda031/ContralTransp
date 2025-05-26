import React, { useState, useEffect } from 'react';
import Navbar from '../../navbar/Navbar';
import { useParams } from 'react-router-dom';
import { InfoCarga, Transporte } from '../../../types/types';
import DescargarService from './services/Descargar.service';
import './styles/ShowInfoTransporte.css';
import { useNotification } from '../../../context/NotificationContext';

const ShowInfoTransporte: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [infoCarga, setInfoCarga] = useState<InfoCarga[]>([]);    
    const [transporte, setTransporte] = useState<Transporte[]>([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { showNotification } = useNotification();

    const toggleNavbar = () => { setIsOpen(!isOpen); }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [cargaResponse, transporteResponse] = await Promise.all([
                    DescargarService.getAll(Number(id)),
                    DescargarService.getInfoID(Number(id))
                ]);

                setInfoCarga(cargaResponse.data);
                setTransporte(transporteResponse.data);
            } catch (error) {
                showNotification('error', 'Error al cargar la información del transporte');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderTransportInfo = () => {
        if (!transporte[0]) return null;
        const transport = transporte[0];

        return (
            <div className="transport-details">
                <div className="detail-card">
                    <h3>Información del Transporte</h3>
                    <div className="detail-item">
                        <span className="detail-label">ID Transporte:</span>
                        <span className="detail-value">{transport.id}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Identificador:</span>
                        <span className="detail-value">{transport.identificador}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Estado:</span>
                        <span className="detail-value">{transport.estado}</span>
                    </div>
                </div>

                <div className="detail-card">
                    <h3>Detalles del Vehículo</h3>
                    <div className="detail-item">
                        <span className="detail-label">Placa:</span>
                        <span className="detail-value">{transport.vehiculo_placa}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Marca:</span>
                        <span className="detail-value">{transport.vehiculo_marca}</span>
                    </div>
                </div>

                <div className="detail-card">
                    <h3>Información del Conductor</h3>
                    <div className="detail-item">
                        <span className="detail-label">Nombre:</span>
                        <span className="detail-value">{transport.conductor_nombre}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Documento:</span>
                        <span className="detail-value">{transport.conductor_cedula}</span>
                    </div>
                </div>

                <div className="detail-card">
                    <h3>Ruta del Transporte</h3>
                    <div className="detail-item">
                        <span className="detail-label">Origen:</span>
                        <span className="detail-value">{transport.almacen_origen_nombre}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Destino:</span>
                        <span className="detail-value">{transport.almacen_destino_nombre}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Fecha Creación:</span>
                        <span className="detail-value">{formatDate(transport.fecha_creacion)}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderCargoTable = () => {
        if (!infoCarga.length) return null;

        return (
            <div className="cargo-table-container">
                <h3>Información de Carga</h3>
                <table className="cargo-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Cantidad</th>
                            <th>Tipo</th>
                            <th>Peso</th>
                            <th>Fecha Ingreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {infoCarga.map((carga) => (
                            <tr key={carga.id}>
                                <td>{carga.sku}</td>
                                <td>{carga.cantidad}</td>
                                <td>{carga.tipo}</td>
                                <td>{carga.peso}</td>
                                <td>{formatDate(carga.fecha_ingreso)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        return (
            <div className="transport-info-container">
                <div className="transport-header">
                    <h1>Detalles del Transporte #{id}</h1>
                </div>
                {renderCargoTable()}
                {renderTransportInfo()}
            </div>
        );
    };

    return (
        <div className="App">
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>       
                <div className="container">
                    <div className="transport-main-container">
                        <div className="transport-container-header">
                            {renderContent()}
                        </div>  
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default ShowInfoTransporte;
