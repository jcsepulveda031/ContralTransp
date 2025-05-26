import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transporte } from '../../../types/types';
import { getTransportes, deleteTransporte} from './services/transporte.service';
import ConfirmationModal from './Modal/ConfirmationModal';
import Navbar from '../../../pages/navbar/Navbar';
import ErrorMessage from './ErrorMessage';
import './styles/TransportTable.css';
import { FaEdit, FaTrashAlt, FaEye, FaSearch } from 'react-icons/fa';

// Utilidad para formatear fecha a dd-mm-yyyy
function formatFecha(fechaIso: string) {
  if (!fechaIso) return '';
  const date = new Date(fechaIso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const CreateTransportTable: React.FC = () => {


  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [transportesOriginales, setTransportesOriginales] = useState<Transporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const fetchTransportes = async () => {
    try {
      setLoading(true);
      const data = await getTransportes();
      setTransportes(data);
      setTransportesOriginales(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los transportes. Por favor, inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      await fetchTransportes();
    };
    getData()
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setTransportes(transportesOriginales);
    } else {
      const filtered = transportes.filter(transportes => 
        transportes.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transportes.conductor_nombre.toLowerCase().includes(searchTerm.toLowerCase())||
        transportes.vehiculo_placa.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTransportes(filtered);
    }
  }, [searchTerm, transportesOriginales]);
  
  const handleCreate = async () => {
      navigate(`/Contaltransp/Transporte/CreateTransp/crear-transporte`);
  };

  const handleDeleteClick = (id: number) => {
    setRecordToDelete(id.toString());
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      await deleteTransporte(Number(recordToDelete));
      fetchTransportes();
    } catch (err) {
      setError('Error al eliminar el transporte. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  return (
    <div >
      <Navbar isOpen={isOpen} onClose={toggleNavbar} />
      <div className={`content ${isOpen ? 'shift' : ''}`}>
      <div className="container">
      <div className="transport-main-container">
      <div className="transport-container-header">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="table-responsive">

              <div className="transport-header-bar">
              <div className="search-bar">
                <FaSearch className="almacen-search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar transporte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar transporte"
                  />
                </div>
                <h1 className="transport-title">Transportes</h1>
                <div className="header-actions">
                  <button className="add-button" onClick={handleCreate}>Crear Transporte</button>
                </div>
              </div>

              {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
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
                      <th>Hora Creación</th>
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
                        <td>{transporte.hora_creacion}</td>
                        <td>
                          <div className="action-buttons-container">
                            <div className="button-wrapper">
                              <button className="icon-button btn-ver" onClick={() => navigate(`/Contaltransp/Transporte/CreateTransp/ver-transporte/${transporte.id}`)}>
                                <FaEye className="icon" />
                                <span className="button-label">Ver</span>
                              </button>
                              <div className="tooltip">Ver</div>
                            </div>
                            <div className="button-wrapper">
                              <button className="icon-button btn-editar" onClick={() => navigate(`/Contaltransp/Transporte/CreateTransp/editar-transporte/${transporte.id}`)}>
                                <FaEdit className="icon" />
                                <span className="button-label">Editar</span>
                              </button>
                              <div className="tooltip">Editar</div>
                            </div>
                            <div className="button-wrapper">
                              <button className="icon-button btn-eliminar" onClick={() => handleDeleteClick(transporte.id)}>
                                <FaTrashAlt className="icon" />
                                <span className="button-label">Eliminar</span>
                              </button>
                              <div className="tooltip">Eliminar</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {showDeleteModal && (
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            message="¿Está seguro que desea eliminar este transporte?"
          />
        )}
      </div>
      </div>
      </div>
      </div>


    
  );
};

export default CreateTransportTable;
