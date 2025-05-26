import React, { useState, useEffect } from 'react';
import './styles/conductor.css';
import Navbar from '../../pages/navbar/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import ConfirmationModal from './Modal/ConfirmationModal';
import ConductorModal from './Modal/ConductorModal';
import { Conductor } from '../../types/types';
import { FaEdit, FaTrashAlt, FaPlus, FaEye } from 'react-icons/fa';
import { getAdminConductor, putAdminConductor, deleteAdminConductor, postAdminConductor, createUserForConductor, getUserForConductor } from './services/admConductor.service';
import PasswordModal from './Modal/PasswordModal';

const ROLE_COLORS: Record<string, string> = {
  creado: '#43bfa3',
};
const RoleChip: React.FC<{ role: string }> = ({ role }) => (
  <span
      className="role-chip"
      style={{
          backgroundColor: ROLE_COLORS[role.toLowerCase()] || ROLE_COLORS.default,
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.95em',
          textTransform: 'capitalize',
          letterSpacing: '0.5px',
          display: 'inline-block',
          minWidth: '70px',
          textAlign: 'center',
      }}
  >
      {role}
  </span>
);
const GestConductorContent: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [filteredConductores, setFilteredConductores] = useState<Conductor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [generatedUser, setGeneratedUser] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showEyeIcon, setShowEyeIcon] = useState(false);
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<Conductor>({
    cedula: '',
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    licencia: '',
    username: '',
    user_id: 0,
  });

  const toggleNavbar = () => setIsOpen(!isOpen);

  const fetchConductores = async () => {
    try {
      const response = await getAdminConductor();
      setConductores(response);
      setFilteredConductores(response);
    } catch (error) {
      showNotification('error', 'No se pudieron cargar los conductores');
    }
  };

  useEffect(() => {
    fetchConductores();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredConductores(conductores);
    } else {
      const filtered = conductores.filter(conductor =>
        conductor.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConductores(filtered);
    }
  }, [searchTerm, conductores]);

  const validateFields = (): boolean => {
    if (!formData.cedula.trim()) {
      showNotification('error', 'La cédula es requerida');
      return false;
    }
    if (!/^[0-9]+$/.test(formData.cedula)) {
      showNotification('error', 'La cédula debe contener solo números');
      return false;
    }
    if (!formData.nombre.trim()) {
      showNotification('error', 'El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      showNotification('error', 'El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showNotification('error', 'Por favor ingrese un email válido');
      return false;
    }
    if (!formData.licencia.trim()) {
      showNotification('error', 'La licencia es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      if (isEditing) {
        const cedulaExists = conductores.some(c => c.cedula === formData.cedula && c.id !== formData.id);
        if (cedulaExists) {
          showNotification('error', 'La cédula ya está registrada');
          return;
        }
        const emailExists = conductores.some(c => c.email === formData.email && c.id !== formData.id);
        if (emailExists) {
          showNotification('error', 'El email ya está registrado');
          return;
        }
        await putAdminConductor(formData.cedula, formData);
        showNotification('success', 'Conductor actualizado exitosamente');
      } else {
        const cedulaExists = conductores.some(c => c.cedula === formData.cedula);
        if (cedulaExists) {
          showNotification('error', 'La cédula ya está registrada');
          return;
        }
        const emailExists = conductores.some(c => c.email === formData.email);
        if (emailExists) {
          showNotification('error', 'El email ya está registrado');
          return;
        }
        await postAdminConductor(formData);
        showNotification('success', 'Conductor creado exitosamente');
      }
      setIsModalOpen(false);
      fetchConductores();
    } catch (error) {
      showNotification('error', 'Ocurrió un error al guardar el conductor');
    }
  };

  const handleEdit = (conductor: Conductor) => {
    setFormData(conductor);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminConductor(id);
      showNotification('success', 'Conductor eliminado exitosamente');
      fetchConductores();
    } catch (error) {
      showNotification('error', 'Ocurrió un error al eliminar el conductor');
    }
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      handleDelete(recordToDelete);
      setIsConfirmationModalOpen(false);
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id) {
      setRecordToDelete(id);
      setIsConfirmationModalOpen(true);
    }
  };

  const handleAddClick = () => {
    setFormData({
      cedula: '',
      nombre: '',
      telefono: '',
      direccion: '',
      email: '',
      licencia: '',
      username: '',
      user_id: 0,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCreateUser = async (conductor: Conductor) => {
    try {
      function generarContrasenaAleatoria(longitud: number = 8): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
        let contrasena = '';
        for (let i = 0; i < longitud; i++) {
          const indice = Math.floor(Math.random() * caracteres.length);
          contrasena += caracteres[indice];
        }
        return contrasena;
      }
      const usuario = conductor.cedula;
      const contrasena = generarContrasenaAleatoria();
      await createUserForConductor(usuario, contrasena, conductor);
      fetchConductores();
      setGeneratedUser(usuario);
      setGeneratedPassword(contrasena);
      setIsPasswordModalOpen(true);
      setShowEyeIcon(true);
      showNotification('success', 'Usuario creado exitosamente');
    } catch (error) {
      showNotification('error', 'No se pudo crear el usuario');
    }
  };

  const handleshowUser = async (conductor: Conductor) => {
    try {
      if (!conductor.user_id) return;
      const response = await getUserForConductor(conductor.user_id);
      if (response) {
        setGeneratedUser(response.username);
        setGeneratedPassword(response.password);
        setIsPasswordModalOpen(true);
        setShowEyeIcon(true);
      }
    } catch (error) {
      showNotification('error', 'No se pudo obtener el usuario');
    }
  };

  return (
    <div >
      <Navbar isOpen={isOpen} onClose={toggleNavbar} />
      <div className={`content ${isOpen ? 'shift' : ''}`}>
        <div className="container">
          <h1>Gestión de Conductores</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por cédula o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleAddClick} className="add-button">
              <FaPlus /> Agregar Conductor
            </button>
          </div>
          <div className="table-wrapper">
            <table className="almacen-table">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Email</th>
                  <th>Licencia</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredConductores.length > 0 ? (
                  filteredConductores.map((conductor) => (
                    <tr key={conductor.id}>
                      <td>{conductor.cedula}</td>
                      <td>{conductor.nombre}</td>
                      <td>{conductor.telefono}</td>
                      <td>{conductor.direccion}</td>
                      <td>{conductor.email}</td>
                      <td>{conductor.licencia}</td>
                      <td>
                        {conductor.username ? (
                          <RoleChip role={'Creado'} />
                        ) : (
                          <button onClick={() => handleCreateUser(conductor)} className="icon-button btn-ver">
                            <FaPlus className="icon" />
                          </button>
                        )}
                      </td>
                      <td>
                      <div className="action-buttons-container">
                        <div className="button-wrapper">
                        <button onClick={() => handleEdit(conductor)} 
                            className="almacen-btn-edit">
                          <FaEdit className="icon" />
                        </button>
                        </div>
                        <div className="button-wrapper">
                        <button onClick={() => handleDeleteClick(conductor.id)} 
                        className="almacen-btn-delete">
                          <FaTrashAlt className="icon" />
                        </button>
                        </div>
                      </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="no-results">
                      No se encontraron conductores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ConductorModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            error={null}
          />
          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={handleConfirmDelete}
            message="¿Estás seguro de que deseas eliminar este conductor?"
          />
          <PasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            usuario={generatedUser}
            contrasena={generatedPassword}
          />
        </div>
      </div>
    </div>
  );
};

const GestConductor: React.FC = () => (
  <AuthProvider>
    <NotificationProvider>
      <GestConductorContent />
    </NotificationProvider>
  </AuthProvider>
);

export default GestConductor;
