import React, { useState } from 'react';
import Navbar from '../../pages/navbar/Navbar';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Proceso } from '../../types/types';

const InventarioContent: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const procesosUsuario: Proceso[] = [
        { icon: '📋', title: 'Control Inventario', description: 'Control de inventario', path: '/Contaltransp/Inventario/ControlInventario' },
        { icon: '📊', title: 'Panel de Control', description: 'Panel de Control', path: '/Contaltransp/Inventario/InventarioDashboard' },
        { icon: '📋', title: 'Control Inventario', description: 'Control de inventario', path: '/Contaltransp/Inventario/ControInventarioV2' },
    ];

    const handleCardClick = (path?: string) => {
        if (path) {
            try {
                navigate(path);
                showNotification('success', 'Navegando a la sección seleccionada');
            } catch (error) {
                showNotification('error', 'Error al navegar a la sección');
            }
        }
    };

    const renderProcesos = () => {
        if (!user) {
            showNotification('warning', 'Usuario no autenticado');
            return null;
        }

        const procesos = procesosUsuario;

        return (
            <div className="procesos-container">
                <h2 className="procesos-titulo">Procesos Disponibles Inventario</h2>
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
        <div className="App">
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>
                <div className='defoult-container'>
                    {renderProcesos()}
                </div>
            </div>
        </div>
    );
};

const Inventario: React.FC = () => {
    return (
            <NotificationProvider>
                <InventarioContent />
            </NotificationProvider>
    );
};

export default Inventario;