import React, { useState, useEffect } from "react";
import Navbar from '../../pages/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { historialDriverTras } from "../../types/types";
import { useAuth } from '../../context/AuthContext';
import { getDiverHistoryTransporte } from "./services/DriverHistory.service";
import { FaEye } from 'react-icons/fa';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import './styles/DriverHistorialTransporte.css';

const DriverHistorialTransporteContent: React.FC = () => { 
    const [formData, setformData] = useState<historialDriverTras[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showNoDataModal, setShowNoDataModal] = useState(false);
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        fetchDriverHistori();
        // eslint-disable-next-line
    }, []);

    const fetchDriverHistori = async () => { 
        try {
            if (!user) {
                showNotification('error', 'Usuario no autenticado');
                return;
            }

            const result = await getDiverHistoryTransporte(user?.id);
            if (result.status === "OK" && result.data && result.data.length > 0) { 
                setformData(result.data);
            } else {
                showNotification('info', 'No hay datos de historial disponibles');
                setShowNoDataModal(true);
                setTimeout(() => { navigate('/Contaltransp'); }, 2000);
            }
            
        } catch (error) {
            showNotification('error', 'Error al cargar el historial de transportes');
            setShowNoDataModal(true);
            setTimeout(() => { navigate('/Contaltransp'); }, 2000);
        } finally {
            setLoading(false);
        }
    }

    const filteredData = formData.filter((item) =>
        item.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.almacen_origen_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.almacen_destino_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehiculo_placa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <div className="App">
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>
                <div className="driver-historial-container">
                    <div className="driver-historial-header">
                        <h1>Historial de Transportes</h1>
                    </div>
                    {loading ? ( <div className="loading">Cargando...</div> ) : (
                        <div className="driver-historial-table-section">
                            <div className="search-add-container">
                                <input  type="text"
                                        placeholder="Buscar por identificador, almacén o placa..."
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="table-wrapper">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Transporte</th>
                                            <th>Almacén Origen</th>
                                            <th>Almacén Destino</th>
                                            <th>Vehículo</th>
                                            <th>Fecha Inicio</th>
                                            <th>Fecha Fin</th>
                                            <th>Detalle</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((formData) => (
                                            <tr key={formData.id}>
                                                <td>{formData.identificador}</td>
                                                <td>{formData.almacen_origen_nombre}</td>
                                                <td>{formData.almacen_destino_nombre}</td>
                                                <td>{formData.vehiculo_placa} - {formData.vehiculo_marca}</td>
                                                <td>{formData.fecha_inicio}</td>
                                                <td>{formData.fecha_fin}</td>
                                                <td>
                                                    <div className="action-buttons-container">
                                                        <div className="button-wrapper">
                                                            <button className="icon-button btn-show" onClick={() => navigate(`/Contaltransp/Historial_Transprotes/ShowInfoHistTransporte/${formData.id}`)}>
                                                                <FaEye className="icon" />
                                                                <span className="button-label">Ver</span>
                                                            </button>
                                                            <div className="tooltip">Ver</div>
                                                        </div>
                                                    </div>                  
                                                </td>
                                                <td><span className={`status-badge ${formData.estado}`}>{formData.estado}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredData.length === 0 && (
                                    <div className="no-data-message">No se encontraron resultados.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showNoDataModal && (
                <div className="modal-overlay">
                    <div className="modal-container delete-modal">
                        <div className="modal-header">
                            <h2>Información importante</h2>
                        </div>
                        <div className="modal-body">
                            <h2>No hay historial de transportes </h2>
                            <p>Serás redirigido automáticamente...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const DriverHistorialTransporte: React.FC = () => (
    <NotificationProvider>
        <DriverHistorialTransporteContent />
    </NotificationProvider>
);

export default DriverHistorialTransporte;