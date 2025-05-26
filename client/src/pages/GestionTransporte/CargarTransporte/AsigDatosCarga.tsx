import React, { useState, useEffect } from 'react';
import Navbar from '../../../pages/navbar/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { ZonaCarga } from '../../../types/types';
import { getCarga, AsignarCarga } from './services/Cargar.service';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';

const AsigDatosCarga: React.FC = () => {
  const [zonaCarga, setZonaCarga] = useState<ZonaCarga[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (id) {
      fetchZonaCarga();
    }
  }, [id]);

  const fetchZonaCarga = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getCarga({ transporte_id: id });
        if (data && data.length > 0) {
          setZonaCarga(data);
        } else {
          setShowNoDataModal(true);
          showNotification('warning', 'No hay datos para cargar. Serás redirigido automáticamente...');
          setTimeout(() => {
            navigate('/Contaltransp/Transporte/CargaTransp');
          }, 2000);
        }
      }
    } catch (err) {
      showNotification('error', 'Error al cargar la información Zona carga. Por favor, inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarClick = async (id_zona: number) => {
    try {
      setLoading(true);
      if(!id || !user?.id )return;
      await AsignarCarga(id_zona,id,user?.id );
      showNotification('success', 'Transporte procesado correctamente');
    } catch (error) {
      showNotification('error', 'Error al asignar valor');
    }
    navigate('/Contaltransp/Transporte/CargaTransp');
  };

  const renderProcesos = () => {
    return (
      <>
        <div className="transport-container">
          <div className="transport-header">
            <h1>Zona de Carga</h1>
          </div>

          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="table-responsive asig-table-container">
              <table className="transport-table">
                <thead>
                  <tr>
                    <th>Unidad id</th>
                    <th>Tipo</th>
                    <th>Codigo</th>
                    <th>Sku</th>
                    <th>Cantidad</th>
                    <th>Peso</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {zonaCarga.map((zonaCarga) => (
                    <tr key={zonaCarga.id}>
                      <td>{zonaCarga.unidad_id}</td>
                      <td>{zonaCarga.tipo}</td>
                      <td>{zonaCarga.codigo}</td>
                      <td>{zonaCarga.sku}</td>
                      <td>{zonaCarga.cantidad}</td>
                      <td>{zonaCarga.peso}</td>
                      <td>{zonaCarga.estado}</td>
                      <td>
                        <button className="btn-ver" onClick={() => handleAsignarClick(zonaCarga.id)}>
                          Asignar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="App">
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

      {showNoDataModal && (
        <div className="modal-overlay">
        <div className="modal-container delete-modal">
          <div className="modal-header">
            <h2>Zona de Carga</h2>
          </div>
          <div className="modal-body">
            <h2>No hay datos para cargar</h2>
            <p>Serás redirigido automáticamente...</p>
          </div>
       
        </div>
      </div>
        
      )}
    </div>
  );
};

export default AsigDatosCarga;
