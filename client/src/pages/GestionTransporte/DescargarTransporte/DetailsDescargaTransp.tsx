import React, { useState, useEffect } from 'react';
import Navbar from '../../../pages/navbar/Navbar';
import { useParams } from 'react-router-dom';
import DescargarService from './services/Descargar.service';
import { InfoCarga } from '../../../types/types';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './styles/SuccessModal.css';
import { FaTruckLoading } from 'react-icons/fa';
import { useNotification } from '../../../context/NotificationContext';

const DetailsDescargaTransp: React.FC = () => {
    const [infoCarga, setInfoCarga] = useState<InfoCarga[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showNoDataModal, setShowNoDataModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [descargaError, setDescargaError] = useState<{ [key: number]: string | null }>({});
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    }

    const handleDescargarClick = async (id: number, zona_id: number) => {
        try {
            setDescargaError({ ...descargaError, [id]: null });
            const user_id = user?.id;
            await DescargarService.descargarCarga(id, zona_id, Number(user_id));
            showNotification('success', 'Carga descargada correctamente');
            setShowSuccessModal(true);
            setTimeout(() => {
                setInfoCarga(prevInfo => prevInfo.filter(item => item.id !== id));
                setShowSuccessModal(false);
                if (infoCarga.length <= 1) {
                    setShowNoDataModal(true);
                    showNotification('warning', 'No hay datos cargados. Serás redirigido automáticamente...');
                    setTimeout(() => {
                        navigate('/Contaltransp/Transporte/DescargaTransporte');
                    }, 2000);
                }
            }, 2000);
        } catch (error) {
            showNotification('error', 'Error al descargar la carga. Por favor, intente nuevamente.');
            setDescargaError({ ...descargaError, [id]: 'Error al descargar la carga. Por favor, intente nuevamente.' });
        }
    }

    useEffect(() => {
        const fetchInfoCarga = async () => {
            try {
                const response = await DescargarService.getInfoCarga(Number(id));
                if(response.data.length > 0){
                    setInfoCarga(response.data);
                }else{
                    setShowNoDataModal(true);
                    setTimeout(() => {
                        navigate('/Contaltransp/Transporte/DescargaTransporte');
                    }, 2000);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        fetchInfoCarga();
    }, []);
    
    const renderProcesos = () => { 
        return(
            <>
            <div className="transport-container">
                <div className="transport-header">
                    <h1>Detalle Carga</h1>
                </div>
                {loading ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="transport-table">
                            <thead>
                                <tr>
                                    <th>Tranporte</th>
                                    <th>Sku</th>
                                    <th>Cantidad</th>
                                    <th>Tipo</th>
                                    <th>Peso</th>
                                    <th>Fecha ingreso</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {infoCarga.map((infoCarga) => (
                                <tr key={infoCarga.id}>
                                    <td>{infoCarga.identificador}</td>
                                    <td>{infoCarga.sku}</td>
                                    <td>{infoCarga.cantidad}</td>
                                    <td>{infoCarga.tipo}</td>
                                    <td>{infoCarga.peso}</td>
                                    <td>{infoCarga.fecha_ingreso}</td>
                                    <td>
                                        <div className="action-buttons-container">
                                            <div className="button-wrapper">
                                                <button className="icon-button btn-editar" onClick={() => handleDescargarClick(infoCarga.id, infoCarga.zona_id)}>
                                                    <FaTruckLoading className="icon" />
                                                    <span className="button-label">Descargar</span>
                                                </button>
                                                <div className="tooltip">Descargar</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showNoDataModal && (
                <div className="modal-overlay">
                    <div className="modal-container delete-modal">
                        <div className="modal-header">
                            <h2>Zona de Carga</h2>
                        </div>
                        <div className="modal-body">
                            <h2>No hay datos Cargados</h2>
                            <p>Serás redirigido automáticamente...</p>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <div className="modal-header">
                            <h2>✓ Descarga Exitosa</h2>
                        </div>
                        <div className="modal-body">
                            <h2>¡Carga descargada correctamente!</h2>
                            <p>El elemento será eliminado de la lista...</p>
                        </div>
                    </div>
                </div>
            )}
            </>
        )
    }

    return (
        <div >
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>       
                <div className="container">
                    <div className="transport-main-container">
                        <div className="transport-container-header">
                            {renderProcesos()}
                        </div>  
                    </div> 
                </div>
            </div>
        </div>
    );
};  

export default DetailsDescargaTransp;
