import React, { useState } from 'react';
import Navbar from '../../pages/navbar/Navbar';
import { AuthProvider, useAuth } from '../../context/AuthContext';

import { useNavigate } from 'react-router-dom';
import { Proceso } from '../../types/types';


const Transporte: React.FC = () => {

    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { user } = useAuth();
    const navigate = useNavigate();
  
    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };

    const procesosUsuario: Proceso[] = [
        { icon: '🚚', title: 'Crear Transporte', description: 'Inicia un nuevo proceso de transporte', path : '/Contaltransp/Transporte/CreateTransp' },
        { icon: '📦', title: 'Cargar Transporte', description: 'Registra la carga de mercancía', path : '/Contaltransp/Transporte/CargaTransp'},
        { icon: '📤', title: 'Descargar Transporte', description: 'Registra la descarga de mercancía', path : '/Contaltransp/Transporte/DescargaTransporte'},
        { icon: '📊', title: 'Historial de Transportes', description: 'Muestra el historial de transportes', path : '/Contaltransp/Transporte/HistorialTransporte'}
      ];

      const handleCardClick = (path?: string) => {
        if (path) {
          navigate(path);
        }
      };
      const renderProcesos = () => {
        if (!user) return null;
      
        const procesos =  procesosUsuario ;
      
        return (
          <div className="procesos-container">
            <h2 className="procesos-titulo">Procesos Disponibles Transportes</h2>
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
          <div className="App">
            {/* Agregamos el Header aquí */}
          
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            
            <div className={`content ${isOpen ? 'shift' : ''}`}>
            <div className='defoult-container'>
                
                {renderProcesos()}
                
              </div>
            </div>
          </div>
        </AuthProvider>
  );
};

export default Transporte;