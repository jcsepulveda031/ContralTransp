import React, { useState, useEffect } from 'react';
import Navbar from '../../../pages/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Transporte } from '../../../types/types';
import ErrorMessage from './ErrorMessage';
import { getTransportes,postTransportFinish } from './services/transporte.service';
import ConfirmationModal from './Modal/ConfirmationModal';
import { FaEye, FaTruckLoading, FaCheckCircle } from 'react-icons/fa';

const ESTADO_COLORS: Record<string, string> = {
    'nuevo': '#38bdf8',
    'cargando': '#f59e42',
    'cargado': '#22c55e',
    'finalizado': '#16a34a',
    'cancelado': '#ef4444',
    'pendiente': '#a78bfa',
    'en proceso': '#fbbf24',
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

// Utilidad para formatear fecha a dd-mm-yyyy
function formatFecha(fechaIso: string) {
  if (!fechaIso) return '';
  const date = new Date(fechaIso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const TransportTableCargar: React.FC = () => { 
    const [transportes, setTransportes] = useState<Transporte[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [finishID, setFinishID] = useState<number | null>(null);
    const navigate = useNavigate();

    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };

      useEffect(() => {
        fetchTransportes();
      }, [searchTerm,finishID]);

    const fetchTransportes = async () => {
          try {
            setLoading(true);
            const data = await getTransportes(searchTerm); // Aquí ahora pasamos solo un string
            setTransportes(data);
            setError(null);
          } catch (err) {
            setError('Error al cargar los transportes. Por favor, inténtelo de nuevo más tarde.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };

    const handleFinishClick = async (id: number) => { 
      setFinishID(id);
      setShowFinishModal(true);
    }
    const handleDelete = async () => {
      if (!finishID ) return;
      
      try {
          await postTransportFinish(finishID)
      } catch (error) {
        setError('Error al Finalizar la carga del transporte.');
      } finally {
        setFinishID(null);
        setShowFinishModal(false);
      }
    }

    const getEstadoColor = (estado: string) => {
      switch (estado) {
        case 'PENDIENTE': return { background: '#38bdf8' };
        case 'EN PROCESO': return { background: '#f59e42' };
        case 'CARGADO': return { background: '#22c55e' };
        case 'FINALIZADO': return { background: '#16a34a' };
        case 'CANCELADO': return { background: '#ef4444' };
        default: return { background: '#6b7280' };
      }
    };

    const renderProcesos = () => {
        return (
            <>
            <div className="transport-container">
                {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
                <div className="transport-header">
                <div className="filters"> 
                        <input type="text" placeholder="Buscar transporte..." value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    </div>
                    <h1>Carga de transporte</h1>
                    
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
                    {transportes.map(transporte => (
                        <tr key={transporte.id}>
                        <td>{transporte.identificador}</td>
                        <td>{transporte.almacen_origen_nombre}</td>
                        <td>{transporte.almacen_destino_nombre}</td>
                        <td>{transporte.conductor_nombre}</td>
                        <td>{transporte.vehiculo_marca} - {transporte.vehiculo_placa}</td>
                        <td>{formatFecha(transporte.fecha_creacion)}</td>
                        <td><EstadoBadge estado={transporte.estado} /></td>
                        <td>
                          <div className="action-buttons-container">
                            <div className="button-wrapper">
                              <button className="icon-button btn-ver" onClick={() => navigate(`/Contaltransp/Transporte/CargaTransp/VerDetalle/${transporte.id}`)}>
                                <FaEye className="icon" />
                                <span className="button-label">Ver</span>
                              </button>
                              <div className="tooltip">Ver</div>
                            </div>
                            <div className="button-wrapper">
                              <button className="icon-button btn-editar" onClick={() => navigate(`/Contaltransp/Transporte/CargaTransp/CargarVehiculo/${transporte.id}`)}>
                                <FaTruckLoading className="icon" />
                                <span className="button-label">Cargar</span>
                              </button>
                              <div className="tooltip">Cargar</div>
                            </div>
                            <div className="button-wrapper">
                              <button className="icon-button btn-eliminar" onClick={() => handleFinishClick(transporte.id)}>
                                <FaCheckCircle className="icon" />
                                <span className="button-label">Finalizar</span>
                              </button>
                              <div className="tooltip">Finalizar</div>
                            </div>
                          </div>
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
            onConfirm={() => handleDelete()}
            message="¿Está seguro que desea Finalizar el transporte?"
          />
            </div>
            
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
  
    )
}

export default TransportTableCargar; 