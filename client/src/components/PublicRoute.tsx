import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {

    return <Navigate to="/Contaltransp" replace />;
  }

  return <Outlet />; // Renderiza las rutas protegidas
};

export default PublicRoute;