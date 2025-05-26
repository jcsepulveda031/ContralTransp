import React, { useState, useEffect } from 'react';
import { Ubicacion } from '../../../types/types';
import '../style/ModalsAlmacen.css';
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { getUbicaciones, postUbicacion, putUbicacion, deleteUbicacion } from '../services/AdmAlmacen.service';
import ConfirmationModal from './ConfirmationModal';
import { useNotification } from '../../../context/NotificationContext';

interface UbicacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  almacenId: number;
  almacenNombre: string;
}

const UbicacionesModal: React.FC<UbicacionesModalProps> = ({
  isOpen,
  onClose,
  almacenId,
  almacenNombre
}) => {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUbicacion, setCurrentUbicacion] = useState<Ubicacion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const { showNotification } = useNotification();
  const toggleNavbar = () => setIsOpen2(!isOpen2);

  useEffect(() => {
    
    if (isOpen) {
      fetchUbicaciones();
    }
  }, [isOpen, almacenId]);

  const fetchUbicaciones = async () => {
    try {
      const response = await getUbicaciones(almacenId);
      setUbicaciones(response);
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      setErrorMessage('Error al cargar las ubicaciones');
      showNotification('error', 'Error al cargar las ubicaciones');
    }
  };

  const handleCreate = async (ubicacionData: Omit<Ubicacion, 'id' | 'almacen_id'>) => {
    try {
      // Validar si el nivel ya existe
      const nivelExistente = ubicaciones.find(
        (ubicacion) => ubicacion.nivel === ubicacionData.nivel
      );
      console.log("nivelExistente", nivelExistente);
      if (nivelExistente?.nivel === ubicacionData.nivel) {
        showNotification('error', 'Este nivel: ' + ubicacionData.nivel + ' ya está registrado');
        return;
      }
      const response = await postUbicacion({ ...ubicacionData, id: 0, almacen_id: almacenId });

      if (response.status) {
        console.log(ubicacionData);
        await fetchUbicaciones();
        setShowCreateModal(false);
        showNotification('success', response.message);
      } else {
        setErrorMessage(response.message);
      } 
    } catch (error) {
      showNotification('error', 'Error al crear la ubicación');
      return false;
    }
  };

  const handleUpdate = async (ubicacionData: Ubicacion) => {
    try {

      

      const response = await putUbicacion(ubicacionData.id, ubicacionData);

      if (response.status) {
        console.log(response);
        await fetchUbicaciones();
        setShowEditModal(false);
        showNotification('success', response.message);
      } else {
        setErrorMessage(response.message);
      }
      
    } catch (error) {
      showNotification('error', 'Error al actualizar la ubicación');
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteUbicacion(id);

      console.log(response);

      if (!response.status) {
        showNotification('error', 'Error al eliminar la ubicación');
      } else {
        showNotification('success', 'Ubicación eliminada exitosamente'); 
        await fetchUbicaciones();
      }
        setIsConfirmationModalOpen(false);
    } catch (error) {
      showNotification('error', 'Error al eliminar la ubicación');
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id) {
      setRecordToDelete(id);
      setIsConfirmationModalOpen(true);
    }
  };
  if (!isOpen) return null;


    return (
      <div className="ubicaciones-page">
        <div className="ubicaciones-header">
        <button className="back-button" onClick={onClose}>
          <FaArrowLeft /> Volver
        </button>
        <h1>Ubicaciones - {almacenNombre}</h1>
      </div>

      <div className="ubicaciones-content">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        <div className="action-bar">
          <button 
            className="add-button"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> Nueva Ubicación
          </button>
        </div>

        <div className="ubicaciones-list">
          <table className="table-container">
            <thead>
              <tr>
                <th>Columna</th>
                <th>Nivel</th>
                <th>Posición</th>
                <th>Tipo</th>
                <th>Stock Actual</th>
                <th>Capacidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((ubicacion) => (
                <tr key={ubicacion.id}>
                  <td>{ubicacion.columna}</td>
                  <td>{ubicacion.nivel}</td>
                  <td>{ubicacion.posicion}</td>
                  <td>{ubicacion.tipo}</td>
                  <td>{ubicacion.stock_actual}</td>
                  <td>{ubicacion.capacidad}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-button edit-button"
                        onClick={() => {
                          setCurrentUbicacion(ubicacion);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon-button delete-button"
                        onClick={() => handleDeleteClick(ubicacion.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear nueva ubicación */}
      {showCreateModal && (
      <div className="edit-modal-overlay">
        <div className="edit-modal-container">
            <div className="modal-header">
              <h2>Nueva Ubicación</h2>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreate({
                  columna: formData.get('columna') as string,
                  nivel: formData.get('nivel') as string,
                  posicion: formData.get('posicion') as string,
                  tipo: formData.get('tipo') as string,
                  stock_actual: Number(formData.get('stock_actual')),
                  capacidad: Number(formData.get('capacidad'))
                });
              }}>
                <div className="form-group">
                  <label>Columna:</label>
                  <input type="text" name="columna" required />
                </div>
                <div className="form-group">
                  <label>Nivel:</label>
                  <input type="text" name="nivel" required />
                </div>
                <div className="form-group">
                  <label>Posición:</label>
                  <input type="text" name="posicion" required />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select name="tipo" required>
                    <option value="picking">Picking</option>
                    <option value="alternate">Alternate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock Actual:</label>
                  <input type="number" name="stock_actual" required min="0" />
                </div>
                <div className="form-group">
                  <label>Capacidad:</label>
                  <input type="number" name="capacidad" required min="0" />
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar ubicación */}
      {showEditModal && currentUbicacion && (
    <div className="edit-modal-overlay">
      <div className="edit-modal-container">
            <div className="modal-header">
              <h2>Editar Ubicación</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdate({
                  ...currentUbicacion,
                  tipo: formData.get('tipo') as string,
                  capacidad: Number(formData.get('capacidad'))
                });
              }}>
                <div className="form-group">
                  <label>Columna:</label>
                  <input type="text" name="columna" defaultValue={currentUbicacion.columna} disabled />
                </div>
                <div className="form-group">
                  <label>Nivel:</label>
                  <input type="text" name="nivel" defaultValue={currentUbicacion.nivel} disabled />
                </div>
                <div className="form-group">
                  <label>Posición:</label>
                  <input type="text" name="posicion" defaultValue={currentUbicacion.posicion} disabled />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select name="tipo" defaultValue={currentUbicacion.tipo} required>
                    <option value="picking">Picking</option>
                    <option value="alternate">Alternate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock Actual:</label>
                  <input type="number" name="stock_actual" defaultValue={currentUbicacion.stock_actual} disabled />
                </div>
                <div className="form-group">
                  <label>Capacidad:</label>
                  <input type="number" name="capacidad" defaultValue={currentUbicacion.capacidad} required min="0" />
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => {
          if (recordToDelete !== null) {
            handleDelete(recordToDelete);
          }
        }}
        message="¿Estás seguro de que deseas eliminar esta ubicación?"
      />
    </div>
  );
};



export default UbicacionesModal;

