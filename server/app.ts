import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

// Rutas
import authentication from './src/routes/Auth.routes';
import adminAlmacen from './src/routes/AdmAlmacen.routes'
import adminConductor from './src/routes/admConductor.routes'
import adminVehiculo from './src/routes/AdmVehiculos.routes'
import adminCreatreTransport from './src/routes/AdmCreateTransporte.routes'
import cargaTransporte from './src/routes/cargaTransportes.routes';
import asignarCarga from  './src/routes/asignarCarga.routes';
import driver from './src/routes/driver.routes';
import UserInfo from './src/routes/UserInfo.routes';
import DescargarTransporte from './src/routes/DescargarTransporte.routes';
import HistorialTransporte from './src/routes/HistorialTransporte.routes';
import Inventario from './src/routes/Inventario.routes';
import Users from './src/routes/Users.routes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de rutas
app.use(cors());
app.use(express.json());
app.use('/api/auth', authentication);
app.use('/api/AdmAlmacen', adminAlmacen);
app.use('/api/AdmConductor', adminConductor);
app.use('/api/AdmVehiculo', adminVehiculo);
app.use('/api/CreateTransportes', adminCreatreTransport);
app.use('/api/CargaTransportes', cargaTransporte);
app.use('/api/CargaInfoDatos', asignarCarga);
app.use('/api/Driver', driver);
app.use('/api/UserInfo', UserInfo);
app.use('/api/DescargarTransporte', DescargarTransporte);
app.use('/api/TransporteHistorial', HistorialTransporte);
app.use('/api/Inventario', Inventario);
app.use('/api/Users', Users);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  