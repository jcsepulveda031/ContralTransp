import React, { useState, useEffect } from 'react';
import Navbar from '../../../pages/navbar/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { InfoCarga } from '../../../types/types';
import ErrorMessage from './ErrorMessage';
import { getInfoCarga, deleteInfoCarga, deleteInfoCargaZona } from './services/Cargar.service';
import ConfirmationModal from './Modal/ConfirmationModal';
import { useNotification } from '../../../context/NotificationContext';

const DetailsCargaTransport: React.FC = () => {  
    const [infoCarga, setInfoCarga] = useState<InfoCarga[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [idsToDelete, setRecordToDelete]  = useState<{id_info: number | null, id_zona: number | null}>({
      id_info: null, 
      id_zona: null
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showNoDataModal, setShowNoDataModal] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const navigate = useNavigate();
    const toggleNavbar = () => { setIsOpen(!isOpen); };
    const { id } = useParams();
    const { showNotification } = useNotification();
    useEffect(() => {
        if (id) {
          fetchZonaCarga();
        }
      }, [id]);
    
      const fetchZonaCarga = async () => {
        try {
          setLoading(true);
          if (id) {
            const data = await getInfoCarga( id );
            if (data && data.length > 0) {
                setInfoCarga(data);
            } else {
                setShowNoDataModal(true);
                showNotification('warning', 'No hay datos cargados. Serás redirigido automáticamente...');
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
    
  const handleDeleteClick = (id_info: number, id_zona: number) => {
    setRecordToDelete({id_info, id_zona});
    setShowDeleteModal(true);
  };
  const handleDelete = async (id_info: number | null, id_zona: number | null)  => {
    if (!id_info || !id_zona ) return;

    try {
      await deleteInfoCarga(id_info);
      await deleteInfoCargaZona(id_zona);
      showNotification('success', 'Registro eliminado correctamente');
      fetchZonaCarga();
    } catch (err) {
      showNotification('error', 'Error al eliminar el transporte. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setRecordToDelete({id_info: null, id_zona: null});
    }
  };
    const renderProcesos = () => { 
        return(
            <>
              <div className="transport-container">
                      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
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
                                      <button className="btn-eliminar" onClick={() => handleDeleteClick(infoCarga.id,infoCarga.zona_id)}>Eliminar</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                        </table>
                    </div>
                  )}
              </div>
          </>
        )
    }

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
                    <h2>No hay datos Cargados</h2>
                    <p>Serás redirigido automáticamente...</p>
                  </div>
                </div>
              </div>
            )}
      {showDeleteModal && (
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDelete(idsToDelete.id_info, idsToDelete.id_zona)}
            message="¿Está seguro que desea Eliminar el registro?"
          />
        )}
        </div>
  
    )
}

export default DetailsCargaTransport;