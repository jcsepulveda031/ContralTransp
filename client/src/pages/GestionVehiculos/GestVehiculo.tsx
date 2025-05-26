import React, { useState, useEffect } from "react";
import Navbar from '../../pages/navbar/Navbar';
import './styles/vehiculo.css';
import { AuthProvider } from '../../context/AuthContext';
import VehiculoForm from "./Modals/VehiculoForm";
import DeleteModal from "./Modals/DeleteModal";
import { Vehiculo } from "../../types/types";
import { getAdminVehiculo,deleteAdminVehiculo,putAdminVehiculo,postAdminVehiculo } from "./services/admVehiculo.service";
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';

const GestVehiculoContent: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState<Vehiculo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { showNotification } = useNotification();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Obtener vehículos desde la API
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await getAdminVehiculo()
        setVehiculos(response);
        setFilteredVehiculos(response); // Inicialmente mostrar todos los vehículos
      } catch (err) {
        showNotification('error', 'Error al obtener los vehículos');
      }
    };

    fetchVehiculos();
  }, [showNotification]);

  // Filtrar vehículos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredVehiculos(vehiculos || []); // Si `vehiculos` es `undefined`, usa `[]`
    } else {
      const filtered = (vehiculos || []).filter( // Filtra solo si `vehiculos` existe
        (vehiculo) =>
          vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehiculos(filtered);
    }
  }, [searchTerm, vehiculos]);

  // Abrir modal de formulario
  const handleOpenForm = (vehiculo: Vehiculo | null = null): void => {
    setSelectedVehiculo(vehiculo);
    setShowForm(true);
  };

  // Abrir modal de eliminación
  const handleOpenDeleteModal = (vehiculo: Vehiculo): void => {
    setSelectedVehiculo(vehiculo);
    setShowDeleteModal(true);
  };

  // Cerrar modales
  const handleCloseModals = (): void => {
    setShowForm(false);
    setShowDeleteModal(false);
    setSelectedVehiculo(null);
  };

  // Eliminar un vehículo
  const handleDelete = async (): Promise<void> => {
    if (!selectedVehiculo) return;
    try {
      if (!selectedVehiculo.id) return;
      const response = await deleteAdminVehiculo(selectedVehiculo.id);
      if (!response) {
        showNotification('error', 'Error al eliminar el vehículo');
        return;
      }
      setVehiculos(vehiculos.filter((v) => v.id !== selectedVehiculo.id));
      handleCloseModals();
      showNotification('success', 'Vehículo eliminado exitosamente');
    } catch (err) {
      showNotification('error', 'Error al eliminar el vehículo');
    }
  };

  // Guardar un vehículo (crear o actualizar)
  const handleSave = async (vehiculo: Vehiculo): Promise<void> => {
    try {
      const placaExistente = vehiculos.some(v => 
        v.placa.toLowerCase() === vehiculo.placa.toLowerCase() && 
        (!vehiculo.id || v.id !== vehiculo.id)
      );
      
      if (placaExistente) {
        showNotification('error', 'La placa ya está registrada');
        return;
      }

      const method = vehiculo.id ? "PUT" : "POST";
      let response;
      if (method == "PUT" ) {
        if(!vehiculo.id) return;
        response = await putAdminVehiculo(vehiculo.id,vehiculo );
      } else {
        response = await postAdminVehiculo(vehiculo);
      }
      if (!response) {
        showNotification('error', 'Error al guardar el vehículo');
        return;
      }
      const updatedVehiculo = await response;
      
      // Actualizar el estado local
      if (vehiculo.id) {
        setVehiculos(vehiculos.map((v) => (v.id === vehiculo.id ? updatedVehiculo : v)));
      } else {
        setVehiculos([...vehiculos, updatedVehiculo]);
      }
      showNotification('success', 'Vehículo guardado exitosamente');
    } catch (err) {
      showNotification('error', 'Error al guardar el vehículo');
    }
  };

  return (
    <div >
      <Navbar isOpen={isOpen} onClose={toggleNavbar} />
      <div className={`content ${isOpen ? 'shift' : ''}`}>
        <div className="vehiculo-table">
          <h1>Gestión de Vehículos</h1>

          <div className="search-add-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="add-button" onClick={() => handleOpenForm()}>Agregar Vehículo</button>
          </div>

          <table className="almacen-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Color</th>
                <th>Placa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehiculos?.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.año}</td>
                  <td>{vehiculo.color}</td>
                  <td>{vehiculo.placa}</td>
                  <td className="actions">
                    <div className="action-buttons-container">
                      <div className="button-wrapper">
                        <button className="almacen-btn-edit" onClick={() => handleOpenForm(vehiculo)}> 
                          <FaEdit className="icon" />
                          <span className="button-label">Editar</span>
                        </button>
                        <div className="tooltip">Editar</div>
                      </div>
                      <div className="button-wrapper">
                        <button className="almacen-btn-delete" onClick={() => handleOpenDeleteModal(vehiculo)}>
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

          {/* Modal de formulario */}
          {showForm && (
            <VehiculoForm
              vehiculo={selectedVehiculo}
              onClose={handleCloseModals}
              onSave={handleSave}
            />
          )}

          {/* Modal de eliminación */}
          {showDeleteModal && selectedVehiculo && (
            <DeleteModal
              vehiculo={selectedVehiculo}
              onClose={handleCloseModals}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const GestVehiculo: React.FC = () => (
  <AuthProvider>
    <NotificationProvider>
      <GestVehiculoContent />
    </NotificationProvider>
  </AuthProvider>
);

export default GestVehiculo;