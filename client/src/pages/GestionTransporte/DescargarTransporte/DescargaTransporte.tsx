import React, { useState, useEffect } from 'react';
import Navbar from '../../../pages/navbar/Navbar';
import DescargarService from './services/Descargar.service';
import { Transporte } from '../../../types/types';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../CargarTransporte/Modal/ConfirmationModal';
import { FaEye, FaTruckLoading, FaCheckCircle } from 'react-icons/fa';
import { useNotification } from '../../../context/NotificationContext';

const ESTADO_COLORS: Record<string, string> = {
    'nuevo': '#38bdf8',
    'cargando': '#f59e42',
    'cargado': '#22c55e',
    'finalizado': '#16a34a',
    'cancelado': '#ef4444',
    'pendiente': '#a78bfa',
    'en proceso': '#fbbf24',
    'descargado': '#43bfa3',
    'arribado': '#e38b29',
    'default': '#6b7280'
};

const EstadoBadge: React.FC<{ estado: string }> = ({ estado }) => (
    <span
        className="estado-badge"
        style={{
            backgroundColor: ESTADO_COLORS[estado.toLowerCase()] || ESTADO_COLORS.default,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.95em',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block',
            minWidth: '90px',
            textAlign: 'center',
        }}
    >
        {estado}
    </span>
);

const DescargaTransporte: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [allTransportes, setAllTransportes] = useState<Transporte[]>([]);
    const [filteredTransportes, setFilteredTransportes] = useState<Transporte[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finishID, setFinishID] = useState<number | null>(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const fetchTransportes = async () => {
        try {
            setLoading(true);
            const response = await DescargarService.getTransportes('');
            if (response.status === 'OK') {
                setAllTransportes(response.data);
                setFilteredTransportes(response.data);
            } else {
                showNotification('error', response.data);
            }
            setLoading(false);
        } catch (err: any) {
            let message = 'Ocurrió un error al descargar los transportes.';
            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            } else if (err.message) {
                message = err.message;
            }
            showNotification('error', message);
            setAllTransportes([]);
            setFilteredTransportes([]);
            setLoading(false);
        }
    };

    // Efecto para el filtrado local
    useEffect(() => {
        filterTransportes(searchTerm);
    }, [searchTerm, allTransportes]);

    const filterTransportes = (term: string) => {
        if (!term.trim()) {
            setFilteredTransportes(allTransportes);
            return;
        }

        const searchTermLower = term.toLowerCase();
        const filtered = allTransportes.filter(transporte => 
            transporte.identificador.toLowerCase().includes(searchTermLower) ||
            transporte.conductor_nombre.toLowerCase().includes(searchTermLower) ||
            `${transporte.vehiculo_marca} ${transporte.vehiculo_placa}`.toLowerCase().includes(searchTermLower)
        );
        setFilteredTransportes(filtered);
    };

    useEffect(() => {
        fetchTransportes();
        // eslint-disable-next-line
    }, []);

    const handleFinishClick = async (id: number) => {
        setFinishID(id);
        setShowFinishModal(true);
    }

    const handleDelete = async () => {
        if (!finishID) return;
        try {
            await DescargarService.finishCarga(finishID);
            await fetchTransportes(); // Recargar la lista después de finalizar
            showNotification('success', 'Transporte finalizado correctamente.');
        } catch (error) {   
            showNotification('error', 'Error al Finalizar la carga del transporte.');
        } finally {
            setFinishID(null);
            setShowFinishModal(false);
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const renderProcesos = () => {
        return (
            <>
            <div className="transport-container">
                <div className="transport-header">
                    <h1>Descarga de transporte</h1>
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Buscar por ID, conductor o vehículo..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input" 
                        />
                        {filteredTransportes.length === 0 && searchTerm && (
                            <div className="no-results">No se encontraron resultados para "{searchTerm}"</div>
                        )}
                    </div>
                </div>
                {loading ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="transport-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Almacén Origen</th>
                                    <th>Almacén Destino</th>
                                    <th>Conductor</th>
                                    <th>Vehículo</th>
                                    <th>Fecha Creación</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransportes.map(transporte => (
                                    <tr key={transporte.id}>
                                        <td>{transporte.identificador}</td>
                                        <td>{transporte.almacen_origen_nombre}</td>
                                        <td>{transporte.almacen_destino_nombre}</td>
                                        <td>{transporte.conductor_nombre}</td>
                                        <td>{transporte.vehiculo_marca} - {transporte.vehiculo_placa}</td>
                                        <td>{formatDate(transporte.fecha_creacion)}</td>
                                        <td><EstadoBadge estado={transporte.estado} /></td>
                                        <td> {transporte.estado === 'DESCARGADO' || transporte.estado === 'ARRIBADO' ? ( 
                                            <div>
                                                <div className="button-wrapper">
                                                    <button className="icon-button btn-ver" onClick={() => navigate(`/Contaltransp/Transporte/DescargarTransporte/ShowInfoTransporte/${transporte.id}`)}>
                                                        <FaEye className="icon" /> 
                                                        <span className="button-label">Detalle</span>
                                                    </button>
                                                    <div className="tooltip">Ver</div>
                                                    </div>
                                                    <div className="button-wrapper">
                                                    <button className="icon-button btn-editar" onClick={() => navigate(`/Contaltransp/Transporte/DescargaTransporte/Descargar/${transporte.id}`)}>
                                                        <FaTruckLoading className="icon" />
                                                        <span className="button-label">Descargar</span>
                                                    </button>
                                                    <div className="tooltip">Descargar</div>
                                                    </div>
                                                    <div className="button-wrapper">
                                                    <button className="icon-button btn-eliminar" onClick={() => handleFinishClick(transporte.id)}>
                                                        <FaCheckCircle className="icon" />
                                                        <span className="button-label">Finalizar</span>
                                                    </button>
                                                    <div className="tooltip">Finalizar</div>
                                                    </div>
                                            </div>

                                            
                                        ) : (
                                            <div>
                                                <button className="btn-ver" onClick={() => navigate(`/Contaltransp/Transporte/DescargarTransporte/ShowInfoTransporte/${transporte.id}`)}>Detalle</button>
                                            </div>
                                        )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <ConfirmationModal
                    isOpen={showFinishModal}
                    onClose={() => setShowFinishModal(false)}
                    onConfirm={handleDelete}
                    message="¿Está seguro que desea Finalizar la descarga del transporte?"
                />
            </div>
            </>
        )
    }

    return (
        <div  >
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>       
                <div className="container">
                    <div className="transport-main-container">
                        <div className="transport-container-header">
                            {loading && <div className="descarga-loading">Cargando transportes...</div>}
                            {!loading && filteredTransportes.length === 0 && (
                                <div className="descarga-no-results">No se encontraron transportes.</div>
                            )}
                            {renderProcesos()}
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DescargaTransporte;
