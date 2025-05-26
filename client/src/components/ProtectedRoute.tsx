import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
    
  }else{
        
        console.log('Esta activo')
    }


  return <Outlet />; // Renderiza las rutas protegidas
};

export default ProtectedRoute;