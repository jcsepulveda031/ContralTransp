import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Configuracion de permisos y accesos
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ForgotPassword from './pages/auhtentication/forgotPassword';
import { NotificationProvider } from './context/NotificationContext';

// Rutas

import Login from './pages/auhtentication/login';
import Register from './pages/auhtentication/register';
import Main from './pages/main';
import AlmacenTable from './pages/GestionAlmacen/GestionAlmacen';
import GestConductor from './pages/GestionConductor/GestConductor';
import GestVehiculo from './pages/GestionVehiculos/GestVehiculo';
import Transporte from './pages/GestionTransporte/Transportes'
import CreateTransportTable from './pages/GestionTransporte/CreateTransport/TransportTable'
import TransportForm from './pages/GestionTransporte/CreateTransport/TransportForm';
import TransportTableCargar from './pages/GestionTransporte/CargarTransporte/TransportTableCargar';
import AsigDatosCargar from './pages/GestionTransporte/CargarTransporte/AsigDatosCarga';
import DetailsCargaTransport from './pages/GestionTransporte/CargarTransporte/datailsCargaTransport';
import DriverDashboard from './pages/Conductores/Conductores';
import UserTable from './pages/GestionUser/UserTable'
import DriverHistorialTransporte from './pages/DriverHistoriaTransporte/DriverHistorialTransporte';
import ShowInfoHistTransporte from './pages/DriverHistoriaTransporte/ShowInfoHistTransporte';
import DescargaTransporte from './pages/GestionTransporte/DescargarTransporte/DescargaTransporte';
import DetailsDescargaTransp from './pages/GestionTransporte/DescargarTransporte/DetailsDescargaTransp';
import ShowInfoTransporte from './pages/GestionTransporte/DescargarTransporte/ShowInfoTransporte';
import HistorialTransporte from './pages/GestionTransporte/HistorialTransporte/HistorialTransporte';
import Inventario from './pages/Inventario/Inventario';
import InventarioDashboard from './pages/Inventario/dashboard/InventarioDashboard';
import ControInventario from './pages/Inventario/ControInventario/ControInventario';
import ControInventarioV2 from './pages/Inventario/ControInventario/ControInventarioV2';
const App: React.FC = () => {

  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas (solo accesibles si no está autenticado) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
            </Route>

            {/* Rutas protegidas (solo accesibles si está autenticado) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/Contaltransp" element={<Main />} />
              <Route path="/Contaltransp/GestAlmacen" element={<AlmacenTable />} />
              <Route path="/Contaltransp/GestConductor" element={<GestConductor />} />
              <Route path="/Contaltransp/GestVehiculo" element={<GestVehiculo />} />
              <Route path="/Contaltransp/Transporte" element={<Transporte />} />
              <Route path="/Contaltransp/Transporte/CreateTransp" element={<CreateTransportTable />} />
              <Route path="/Contaltransp/Transporte/CreateTransp/crear-transporte" element={<TransportForm onSubmit={(data) => console.log('Enviando datos:', data)} /> }/>
              <Route path="/Contaltransp/Transporte/CreateTransp/editar-transporte/:id" element={<TransportForm onSubmit={(data) => console.log('Enviando datos:', data)} /> }/>
              <Route path="/Contaltransp/Transporte/CreateTransp/ver-transporte/:id" element={<TransportForm onSubmit={(data) => console.log('Enviando datos:', data)} /> }/>
              <Route path="/Contaltransp/Transporte/CargaTransp" element={<TransportTableCargar />} /> 
              <Route path="/Contaltransp/Transporte/CargaTransp/CargarVehiculo/:id" element={<AsigDatosCargar />} />
              <Route path="/Contaltransp/Transporte/CargaTransp/VerDetalle/:id" element={<DetailsCargaTransport />} />
              <Route path='/Contaltransp/Transporte/DescargaTransporte' element={<DescargaTransporte />} />
              <Route path='/Contaltransp/Transporte/DescargaTransporte/Descargar/:id' element={<DetailsDescargaTransp />} />
              <Route path="/Contaltransp/GestUser" element={<UserTable />} />
              <Route path="/Contaltransp/Conductores" element={<DriverDashboard />} />
              <Route path="/Contaltransp/Historial_Transprotes" element={<DriverHistorialTransporte />} />
              <Route path="/Contaltransp/Historial_Transprotes/ShowInfoHistTransporte/:id" element={<ShowInfoHistTransporte />} />  
              <Route path="/Contaltransp/Transporte/DescargarTransporte/ShowInfoTransporte/:id" element={<ShowInfoTransporte />} />
              <Route path="/Contaltransp/Transporte/HistorialTransporte" element={<HistorialTransporte />} />
              <Route path="/Contaltransp/Inventario/InventarioDashboard" element={<InventarioDashboard />} />
              <Route path='/Contaltransp/Inventario/ControlInventario' element={<ControInventario/>}/>
              <Route path='/Contaltransp/Inventario' element={<Inventario/>}/>
              <Route path='/Contaltransp/Inventario/ControInventarioV2' element={<ControInventarioV2/>}/>
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;