import React, { useState, useEffect } from 'react';
import './style/almacen.css';
import Navbar from '../navbar/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import CreateAlmacenModal from './Modal/CreateAlmacenModal'
import EditAlmacenModal from './Modal/EditAlmacenModal';
import UbicacionesModal from './Modal/UbicacionesModal';
import UsuariosModal from './Modal/UsuariosModal';
import { Almacen,Ubicacion } from '../../types/types';
import { getAdminAlmacenes, getAdminAlmacenesName, postAlmacen,putAlmacen,deleteAlmacen,showFinalAlmacen } from './services/AdmAlmacen.service';
import { FaEdit, FaTrashAlt, FaSearch, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import { DataSaverOff } from '@mui/icons-material';
import ConfirmationModal from './Modal/ConfirmationModal';

const AlmacenTableContent: React.FC = () => {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAlmacen, setCurrentAlmacen] = useState<Almacen | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showUbicacionesModal, setShowUbicacionesModal] = useState(false);
  const [selectedAlmacen, setSelectedAlmacen] = useState<Almacen | null>(null);
  const { showNotification } = useNotification();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUsuariosModal, setShowUsuariosModal] = useState(false);
  const [selectedAlmacenForUsers, setSelectedAlmacenForUsers] = useState<Almacen | null>(null);
  const toggleNavbar = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  const fetchAlmacenes = async () => {
    try {
      const response = await getAdminAlmacenes();
      setAlmacenes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al obtener almacenes:', error);
      showNotification('error', 'No se pudieron cargar los almacenes. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await getAdminAlmacenesName(searchTerm);
      setAlmacenes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al buscar almacenes:', error);
      showNotification('error', 'Error al buscar almacenes');
    }
  };

  const openCreateModal = async () => {
    try {
      const response = await showFinalAlmacen();
      const proximoCodigo = response.id[0].proximo_codigo;
      setCurrentAlmacen({ 
        id: 0,
        codigo: proximoCodigo,
        nombre: '',
        departamento: '',
        ciudad: '',
        direccion: '' 
      });
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error al obtener próximo código:', error);
      showNotification('error', 'No se pudo generar el código automático');
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id) {
      setRecordToDelete(id);
      setIsConfirmationModalOpen(true);
    }
  };
  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const getNextAlmacenCode = async (): Promise<string> => {
    try {
      const response = await showFinalAlmacen();
      return response.id[0].proximo_codigo;
    } catch (error) {
      console.error('Error al obtener próximo código:', error);
      throw error;
    }
  };

  const handleCreate = async (almacenData: Omit<Almacen, 'id'>) => {
    try {
      const exists = almacenes.some(a => a.codigo === almacenData.codigo);
      if (exists) {
        showNotification('warning', 'El código de almacén ya existe. Por favor, use un código diferente.');
        return false;
      }
      await postAlmacen(almacenData);
      await fetchAlmacenes();
      setShowCreateModal(false);
      showNotification('success', 'Almacén creado exitosamente');
      return true;
    } catch (error) {
      showNotification('error', 'Error al crear el almacén. Por favor, inténtalo de nuevo.');
      return false;
    }
  };

  const handleUpdate = async (almacenData: Almacen) => {
    try {
      await putAlmacen(almacenData.id, almacenData);
      await fetchAlmacenes();
      setShowEditModal(false);
      showNotification('success', 'Almacén actualizado exitosamente');
      return true;
    } catch (error) {
      showNotification('error', `Error al actualizar almacén: ${almacenData.codigo}`);
      return false;
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteAlmacen(deleteId);
        await fetchAlmacenes();
        showNotification('success', 'Almacén eliminado exitosamente');
      } catch (error) {
        showNotification('error', 'Error al eliminar el almacén');
      } finally {
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    }
  };

    const openUbicacionesModal = (almacen: Almacen) => {
      setSelectedAlmacen(almacen);
      setShowUbicacionesModal(true);
    };

  const openEditModal = (almacen: Almacen) => {
    setCurrentAlmacen(almacen);
    setShowEditModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDelete();
      setShowDeleteConfirmation(false);
    }
  };

  const openUsuariosModal = (almacen: Almacen) => {
    setSelectedAlmacenForUsers(almacen);
    setShowUsuariosModal(true);
  };

  return (
    <div >
      <Navbar isOpen={isOpen} onClose={toggleNavbar} />
      <div className={`content ${isOpen ? 'shift' : ''} `}>
        <div className="container">
          <h1>Gestión de Almacenes</h1>
          <div className="search-bar">
            
              <FaSearch className="almacen-search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre de almacén"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar almacén"
              />
            
            <button onClick={handleSearch} className="almacen-btn-search">
              Buscar
            </button>
            <button className="add-button" onClick={openCreateModal} aria-label="Agregar almacén">
              Agregar Almacén
            </button>
          </div>
          <div className="p-6">
            <div className="table-wrapper">
              <table className="almacen-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Ciudad</th>
                    <th>Dirección</th>
                    <th>Usuarios</th>
                    <th>Ubicaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {almacenes.map((almacen) => (
                    <tr key={almacen.id}>
                      <td>{almacen.codigo}</td>
                      <td>{almacen.nombre}</td>
                      <td>{almacen.ciudad}</td>
                      <td>{almacen.direccion}</td>
                      <td>
                        <div className="button-wrapper">
                          <button
                            className="almacen-btn-show"
                            onClick={() => openUsuariosModal(almacen)}
                            aria-label="Ver usuarios"
                          >
                            <FaUsers size={16} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="button-wrapper">
                          <button
                            className="almacen-btn-show"
                            onClick={() => openUbicacionesModal(almacen)}
                            aria-label="Ver ubicaciones"
                          >
                            <FaMapMarkedAlt size={16} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="button-wrapper">
                          <button
                            className="almacen-btn-edit"
                            onClick={() => openEditModal(almacen)}
                            aria-label="Editar almacén"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            className="almacen-btn-delete"
                            onClick={() => handleDeleteClick(almacen.id)}
                            aria-label="Eliminar almacén"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <CreateAlmacenModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
        getNextCode={getNextAlmacenCode}
      />
      
      {currentAlmacen && (
        <EditAlmacenModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
          almacen={currentAlmacen}
        />
      )}
      
      <ConfirmationModal
                  isOpen={isConfirmationModalOpen}
                  onClose={() => setIsConfirmationModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                  message="¿Estás seguro de que deseas eliminar este almacén?"
                />

      {selectedAlmacen && (
        <UbicacionesModal
          isOpen={showUbicacionesModal}
          onClose={() => {
            setShowUbicacionesModal(false);
            setSelectedAlmacen(null);
          }}
          almacenId={selectedAlmacen.id}
          almacenNombre={selectedAlmacen.nombre}
        />
      )}

      {selectedAlmacenForUsers && (
        <UsuariosModal
          isOpen={showUsuariosModal}
          onClose={() => {
            setShowUsuariosModal(false);
            setSelectedAlmacenForUsers(null);
          }}
          almacenId={selectedAlmacenForUsers.id}
          almacenNombre={selectedAlmacenForUsers.nombre}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        message="¿Estás seguro de que deseas eliminar este almacén?"
      />
    </div>
  );
};

const AlmacenTable: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AlmacenTableContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default AlmacenTable;