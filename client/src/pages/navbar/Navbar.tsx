import React, { useState, useEffect } from 'react';
import NavItem from './NavItem';
import './styles/Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import NavbarService from './services/navbar.service';

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Alarm {
  id: number;
  description: string;
}

const NavbarContent: React.FC<NavbarProps> = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isTransportDropdownOpen, setTransportDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<'info' | 'password' | 'photo' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isInventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);
  const { showNotification } = useNotification();
  const [infoForm, setInfoForm] = useState({
    id: 0,
    username: '',
    name: '',
    email: '',
    age: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    id: 0,
    actual: '',
    nueva: '',
    confirmar: ''
  });

  useEffect(() => {
    if (user !== null || !isAuthenticated) {
      setIsLoading(false);
    }
    if (user?.nombre_usuario) {
      fetchAlarms();
      fetchProfileImage();
    }
  }, [user, isAuthenticated]);

  const fetchAlarms = async () => {
    if (!user?.nombre_usuario) return;
    try {
      // const response = await axios.get(`/api/alarms/${user.nombre_usuario}`);
      // setAlarms(response.data);
      // showNotification('success', 'Alarmas actualizadas');
    } catch (error) {
      showNotification('error', 'Error al obtener alarmas');
    }
  };

  const fetchProfileImage = async () => {
    if (!user?.id) return;
    try {
      // const response = await axios.get(`/api/users/${user.id}/profile-image`);
      // setProfileImage(response.data.imageUrl);
      // showNotification('success', 'Imagen de perfil actualizada');
    } catch (error) {
      showNotification('error', 'Error al obtener imagen de perfil');
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfoForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveInfo = async (info: any) => {
    try {
      const response = await NavbarService.updateInfo(info);
      if (response.status) {
        showNotification('success', 'Información actualizada correctamente');
        setOpenModal(null);
      } else {
        showNotification('error', 'Error al actualizar la información');
      }
    } catch (error) {
      showNotification('error', 'Error al actualizar la información');
    }
  };

  const handleChangePassword = async (password: any) => {
    try {
      const response = await NavbarService.changePassword(password, user?.id  || 0);
      if (response.status ) {
        showNotification('success', 'Contraseña cambiada correctamente');
        setOpenModal(null);
      } else {
        showNotification('error', 'Error al cambiar la contraseña');
      }
    } catch (error) {
      showNotification('error', 'Error al cambiar la contraseña');
    }
  };

  const handleChangePhoto = async () => {
    try {
      const response = await NavbarService.changePhoto(selectedFile);
      if (response.status === 200) {
        showNotification('success', 'Foto de perfil actualizada');
        setOpenModal(null);
      } else {
        showNotification('error', 'Error al cambiar la foto de perfil');
      }
    } catch (error) {
      showNotification('error', 'Error al cambiar la foto de perfil');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/Login';
  };

  const navAdminAlmacen = () => {
    navigate('/Contaltransp/GestAlmacen');
  };

  const handleOpenInfoModal = async () => {
    try {
      const response = await NavbarService.getUserInfo(user?.nombre_usuario || '');
      if (response.status) {
        setInfoForm({
              id: response.data[0].id,
              username: response.data[0].username,
              name: response.data[0].name,
              email: response.data[0].email,
              age: response.data[0].age,
              phone: response.data[0].phone
            });
      } else {
        showNotification('error', 'No se pudo obtener la información del usuario');
      }

      setOpenModal('info');
    } catch (error) {
      showNotification('error', 'No se pudo obtener la información del usuario');
    }
  };

  if (isLoading) {
    return <div className={`sidebar ${isOpen ? 'open' : ''}`}>Cargando...</div>;
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
      <button className="sidebar-toggle-icon" onClick={onClose}>
          {isOpen ? '✖' : '☰'}
        </button>
        <div className="header-left"><h2>ContalTransp</h2></div>
      </div>

      {/* Sección de perfil y alarmas movida aquí */}
      {isAuthenticated && (
        <div className="profile-alarms-section">
          <div className="sidebar-profile-section">
            <img 
              src={profileImage || 'https://i.pravatar.cc/40'} 
              alt="Perfil" 
              className="profile-image"
              onClick={() => setShowMenu(!showMenu)}
            />
            {isOpen && (
              <div className="profile-info">
                <span className="sidebar-username">{user?.nombre_usuario}</span>
                <span className="sidebar-userrole">{user?.rol}</span>
              </div>
            )}
            
            {showMenu && (
              <div className="profile-menu">
                <button onClick={handleOpenInfoModal}>Actualizar Info</button>
                <button onClick={() => setOpenModal('password')}>Cambiar Contraseña</button>
                <button onClick={() => setOpenModal('photo')}>Cambiar Foto</button>
              </div>
            )}
          </div>

          <div className="alarm-section">
            {isOpen ? (
              <>
                <span className="alarm-badge">Alarmas ({alarms.length})</span>
                {alarms.length > 0 && (
                  <div className="alarm-dropdown">
                    {alarms.map((alarm: any) => (
                      <div key={alarm.id} className="alarm-item">
                        <span>{alarm.description}</span>
                        <button onClick={() => setAlarms(alarms.filter((a) => a.id !== alarm.id))}>X</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="alarm-icon-container">
                <span className="alarm-icon">🔔</span>
                {alarms.length > 0 && (
                  <span className="alarm-counter">{alarms.length}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <ul className="sidebar-nav">
        <NavItem icon="🏠" label="Inicio" to="/Contaltransp" isSidebarOpen={isOpen}/>

        {isAuthenticated && user?.rol === 'admin' && (
          <>
            <NavItem icon="👥" label="Gestion de usuarios" to="/Contaltransp/GestUser" isSidebarOpen={isOpen} />
            <NavItem icon="📄" label="Panel de Admin" isSidebarOpen={isOpen} />
            <NavItem icon="📦" label="Administrar Almacén" onClick={navAdminAlmacen} isSidebarOpen={isOpen}/>
            <NavItem icon="🚗" label="Gestionar Conductor" to="/Contaltransp/GestConductor" isSidebarOpen={isOpen} />
            <NavItem icon="🚛" label="Gestionar Vehículo" to="/Contaltransp/GestVehiculo" isSidebarOpen={isOpen}/>
            
            <li
              className="sidebar-item has-dropdown"
              onClick={() => setTransportDropdownOpen(!isTransportDropdownOpen)}
            >
              <span className="sidebar-icon">🚚</span>
              <span className="sidebar-label">Gestionar Transporte</span>
              <span className="sidebar-dropdown-icon">
                {isTransportDropdownOpen ? '▲' : '▼'}
              </span>
            </li>

            {isTransportDropdownOpen && (
            <ul className="sidebar-submenu open">
              <NavItem icon="➕" label="Crear Transporte" to="/Contaltransp/Transporte/CreateTransp" isSidebarOpen={isOpen}/>
              <NavItem icon="📦" label="Cargar Transporte" to="/Contaltransp/Transporte/CargaTransp" isSidebarOpen={isOpen}/>
              <NavItem icon="📤" label="Descargar Transporte" to="/Contaltransp/Transporte/DescargaTransporte" isSidebarOpen={isOpen}/>
            </ul>
          )}

          <li className="sidebar-item has-dropdown"
              onClick={() => setInventoryDropdownOpen(!isInventoryDropdownOpen)}>
              <span className="sidebar-icon">📦➡️📦</span>
              <span className="sidebar-label">Inventario</span>
              <span className="sidebar-dropdown-icon">
                {isInventoryDropdownOpen ? '▲' : '▼'}
              </span>
          </li>

          {isInventoryDropdownOpen && (
            <ul className="sidebar-submenu open">
              <NavItem icon="📋" label="Control Inventario" to="/Contaltransp/Inventario/ControlInventario"  isSidebarOpen={isOpen}/>
              <NavItem icon="📊" label="Historial de transportes" to="/Contaltransp/Inventario/InventarioDashboard" isSidebarOpen={isOpen}/>
            </ul>
          )}

          <NavItem icon="⏱️" label="Seguimiento Transportes" to="/Contaltransp/Conductores" isSidebarOpen={isOpen}/>
          <NavItem icon="👷" label="Historial de transportes" to="/Contaltransp/Historial_Transprotes" isSidebarOpen={isOpen}/>
          </>
        )}

        {isAuthenticated && user?.rol === 'user' && (
          <>
            <li
              className="sidebar-item has-dropdown"
              onClick={() => setTransportDropdownOpen(!isTransportDropdownOpen)}
            >
              <span className="sidebar-icon">🚚</span>
              <span className="sidebar-label">Gestionar Transporte</span>
              <span className="sidebar-dropdown-icon">
                {isTransportDropdownOpen ? '▲' : '▼'}
              </span>
            </li>

            {isTransportDropdownOpen && (
            <ul className="sidebar-submenu open">
              <NavItem icon="➕" label="Crear Transporte" to="/Contaltransp/Transporte/CreateTransp" isSidebarOpen={isOpen}/>
              <NavItem icon="📦" label="Cargar Transporte" to="/Contaltransp/Transporte/CargaTransp" isSidebarOpen={isOpen}/>
              <NavItem icon="📤" label="Descargar Transporte" to="/Contaltransp/Transporte/DescargaTransporte" isSidebarOpen={isOpen}/>
              <NavItem icon="📊" label="Historial de transportes" to="/Contaltransp/Transporte/HistorialTransporte" isSidebarOpen={isOpen}/>
            </ul>
          )}
          <li className="sidebar-item has-dropdown"
              onClick={() => setInventoryDropdownOpen(!isInventoryDropdownOpen)}>
              <span className="sidebar-icon">📦➡️📦</span>
              <span className="sidebar-label">Inventario</span>
              <span className="sidebar-dropdown-icon">
                {isInventoryDropdownOpen ? '▲' : '▼'}
              </span>
          </li>

          {isInventoryDropdownOpen && (
            <ul className="sidebar-submenu open">
              <NavItem icon="📋" label="Control Inventario" to="/Contaltransp/Inventario/ControlInventario"  isSidebarOpen={isOpen}/>
              <NavItem icon="📊" label="Historial de transportes" to="/Contaltransp/Inventario/InventarioDashboard" isSidebarOpen={isOpen}/>
            </ul>
          )}
          </>
        )}

        {isAuthenticated && user?.rol === 'driver' && (
          <>
          <NavItem icon="⏱️" label="Seguimiento Transportes" to="/Contaltransp/Conductores" isSidebarOpen={isOpen}/>
          <NavItem icon="👷" label="Historial de transportes" to="/Contaltransp/Historial_Transprotes" isSidebarOpen={isOpen}/>
          </>

          
        )}



        {isAuthenticated ? (
          <NavItem icon="🚪" label="Cerrar Sesión" onClick={handleLogout} isSidebarOpen={isOpen}/>
        ) : (
          <NavItem icon="🔑" label="Iniciar Sesión" to="/login" isSidebarOpen={isOpen}/>
        )}
      </ul>

      {/* Modales */}
      <Modal open={openModal === 'info'} onClose={() => setOpenModal(null)}>
        <Box className="modal-box">
          <h2>Actualizar Información</h2>
          <TextField label="Nombre" name="name" value={infoForm.name} onChange={handleInfoChange} fullWidth />
          <TextField label="Correo" name="email" value={infoForm.email} onChange={handleInfoChange} fullWidth />
          <TextField label="Año" name="age" value={infoForm.age} onChange={handleInfoChange} fullWidth />
          <TextField label="Teléfono" name="phone" value={infoForm.phone} onChange={handleInfoChange} fullWidth />
          <Button variant="contained" color="primary" onClick={() => handleSaveInfo(infoForm)}>Guardar</Button>
        </Box>
      </Modal>
      <Modal open={openModal === 'password'} onClose={() => setOpenModal(null)}>
        <Box className="modal-box">
          <h2>Cambiar Contraseña</h2>
          <TextField label="Contraseña Actual" name="actual" type="password" value={passwordForm.actual} onChange={handlePasswordChange} fullWidth />
          <TextField label="Nueva Contraseña" name="nueva" type="password" value={passwordForm.nueva} onChange={handlePasswordChange} fullWidth helperText="Debe tener al menos 8 caracteres, incluir una letra mayúscula y un número" />
          <TextField label="Confirmar Nueva Contraseña" name="confirmar" type="password" value={passwordForm.confirmar} onChange={handlePasswordChange} fullWidth helperText="Debe coincidir con la nueva contraseña" />
          <Button variant="contained" color="primary" onClick={() => handleChangePassword(passwordForm)}>Guardar</Button>
        </Box>
      </Modal>
      <Modal open={openModal === 'photo'} onClose={() => setOpenModal(null)}>
        <Box className="modal-box">
          <h2>Cambiar Foto</h2>
          <div className="profile-preview-container">
            <div className="profile-preview">
              {selectedFile ? (
                <img 
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview" 
                  className="profile-preview-image"
                />
              ) : (
                <img 
                  src={profileImage || 'https://i.pravatar.cc/40'}
                  alt="Preview" 
                  className="profile-preview-image"
                />
              )}
            </div>
          </div>
          <input type="file" onChange={handleFileChange} />
          <Button variant="contained" color="primary" onClick={handleChangePhoto}>Subir</Button>
        </Box>
      </Modal>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = (props) => (
  <NotificationProvider>
    <NavbarContent {...props} />
  </NotificationProvider>
);

export default Navbar;