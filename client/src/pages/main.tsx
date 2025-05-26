import React, { useState } from 'react';
import Navbar from './navbar/Navbar';
import './styles/main.css';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Proceso = {
  icon: string;
  title: string;
  description: string;
  path?: string; // Hacemos path opcional con el signo ?
};


const Main: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

   // Procesos para cada tipo de usuario
  const procesosAdmin: Proceso[] = [
    { icon: '👥', title: 'Gestionar Usuarios', description: 'Administra la información de usuarios', path: '/Contaltransp/GestUser' },
    { icon: '📦', title: 'Administrar Almacén', description: 'Gestiona los almacenes disponibles', path: '/Contaltransp/GestAlmacen' },
    { icon: '🚗', title: 'Gestionar Conductores', description: 'Administra la información de conductores', path: '/Contaltransp/GestConductor' },
    { icon: '🚛', title: 'Gestionar Vehículos', description: 'Controla el parque vehicular', path: '/Contaltransp/GestVehiculo' },
    { icon: '🚚', title: 'Gestionar Transportes', description: 'Administra los transportes en curso', path: '/Contaltransp/Transporte' },
    { icon: '👷', title: 'Historial de transportes ', description: 'Dashboard Conductores', path: '/Contaltransp/Historial_Transprotes' },
    { icon: '⏱️', title: 'Seguimiento Transportes', description: 'Monitorea tiempos y estados', path: '/Contaltransp/Conductores' },
    { icon: '📊', title: 'Reportes', description: 'Genera reportes del sistema', path: '/Contaltransp/Reportes' },
    { icon: '📦', title: 'Inventario', description: 'Gestiona el inventario de la empresa', path: '/Contaltransp/Inventario' }
]

  const procesosUsuario: Proceso[] = [
    { icon: '🚚', title: 'Gestionar Transportes', description: 'Administra los transportes en curso', path: '/Contaltransp/Transporte' },
    { icon: '📦', title: 'Inventario', description: 'Gestiona el inventario de la empresa', path: '/Contaltransp/Inventario' }
  ];

const procesosConductor: Proceso[] = [
  { icon: '⏱️', title: 'Seguimiento Transportes', description: 'Monitorea tiempos y estados', path: '/Contaltransp/Conductores' },
  { icon: '👷', title: 'Historial de transportes ', description: 'Dashboard Conductores', path: '/Contaltransp/Historial_Transprotes' },
];

const handleCardClick = (path?: string) => {
  if (path) {
    navigate(path);
  }
};


 
const renderProcesos = () => {
  if (!user) return null;

  const procesos =  user.rol === 'admin' ? procesosAdmin : 
                    user.rol === 'user' ? procesosUsuario : 
                    user.rol === 'driver' ? procesosConductor:
                    procesosConductor;

  return (
    
    <div className="procesos-container">
      <div className="dashboard-header">
        <h1 className="main-title">
          ContalTransp - Plataforma de Gestión Integral de Transportes
        </h1>
        <h2 className="subtitle">
          Bienvenido, {user?.nombre_usuario || ''}
        </h2>
        <p className="dashboard-description">
          Administra y controla todos los procesos logísticos de tu organización desde un solo lugar.
        </p>
      </div>
      <div className="procesos-grid">
        {procesos.map((proceso, index) => (
          <div 
            key={index} 
            className="proceso-card"
            onClick={() => handleCardClick(proceso.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(proceso.path)}
          >
            <div className="proceso-icon">{proceso.icon}</div>
            <h1 className="proceso-title">{proceso.title}</h1>
            <p className="proceso-description">{proceso.description}</p>
            {proceso.path && <span className="proceso-link">Ir al proceso →</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

  return (
    <AuthProvider>

        <Navbar isOpen={isOpen} onClose={toggleNavbar} />
        
        <div className={`content ${isOpen ? 'shift' : ''}`}>
        <div className='defoult-container'>
            
              {renderProcesos()}
            
          </div>
        </div>

    </AuthProvider>
  );
};

export default Main;
