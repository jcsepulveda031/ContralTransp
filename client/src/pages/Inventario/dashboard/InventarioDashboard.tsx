import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Warehouse, Location, Product, Alert, StockMetrics, FilterOptions } from './types';
import './styles/InventarioDashboard.css';
import { AuthProvider } from '../../../context/AuthContext';
import Navbar from '../../navbar/Navbar';
import { NotificationProvider, useNotification } from '../../../context/NotificationContext';

const InventarioDashboardContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [metrics, setMetrics] = useState<StockMetrics>({
    totalStock: 0,
    availableLocations: 0,
    occupiedLocations: 0,
    pendingMovements: 0,
    lowStockItems: 0,
  });
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { showNotification } = useNotification();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Mock data - Replace with real API calls
  const warehouses: Warehouse[] = [
    { id: 1, name: 'Almacén Principal', capacity: 1000, currentStock: 750 },
    { id: 2, name: 'Almacén Secundario', capacity: 500, currentStock: 300 },
    { id: 3, name: 'Zona de Carga', capacity: 200, currentStock: 50 },
  ];

  const mockStockData = [
    { name: 'Ene', stock: 4000 },
    { name: 'Feb', stock: 3000 },
    { name: 'Mar', stock: 2000 },
    { name: 'Abr', stock: 2780 },
    { name: 'May', stock: 1890 },
    { name: 'Jun', stock: 2390 },
  ];

  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      message: 'Stock bajo en ubicación A-12',
      location: 'A-12',
      timestamp: new Date(),
      status: 'active',
    },
    {
      id: '2',
      type: 'error',
      message: 'Producto expirado en B-05',
      location: 'B-05',
      timestamp: new Date(),
      status: 'active',
    },
  ];

  useEffect(() => {
    try {
      // Aquí iría la lógica para cargar datos reales
      setMetrics({
        totalStock: 2450,
        availableLocations: 156,
        occupiedLocations: 44,
        pendingMovements: 12,
        lowStockItems: 8,
      });
    } catch (error) {
      showNotification('error', 'Error al cargar los datos del dashboard');
    }
  }, []);

  const handleWarehouseChange = (event: SelectChangeEvent<number>) => {
    try {
      setSelectedWarehouse(event.target.value as number);
      showNotification('success', 'Almacén seleccionado correctamente');
    } catch (error) {
      showNotification('error', 'Error al cambiar el almacén');
    }
  };

  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    try {
      setFilters(prev => ({
        ...prev,
        [field]: value,
      }));
      showNotification('success', 'Filtros actualizados');
    } catch (error) {
      showNotification('error', 'Error al actualizar los filtros');
    }
  };

  const renderProcesos = () => { 
    return (
      <Container maxWidth="xl" className="inventario-dashboard">
        <Box sx={{ flexGrow: 1, py: 3 }}>
          {/* Header Section */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1" gutterBottom>
                Control de Inventario
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Gestión y monitoreo de stock en tiempo real
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Seleccionar Almacén</InputLabel>
                <Select
                  value={selectedWarehouse}
                  onChange={handleWarehouseChange}
                  label="Seleccionar Almacén"
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={() => {
                  showNotification('info', 'Funcionalidad de filtros en desarrollo');
                }}
              >
                Filtros
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  showNotification('info', 'Funcionalidad de nuevo movimiento en desarrollo');
                }}
              >
                Nuevo Movimiento
              </Button>
            </Grid>
          </Grid>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h6">Stock Total</Typography>
                  </Box>
                  <Typography variant="h4">{metrics.totalStock}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unidades disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Typography variant="h6">Ubicaciones</Typography>
                  </Box>
                  <Typography variant="h4">{metrics.availableLocations}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Espacios disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Typography variant="h6">Alertas</Typography>
                  </Box>
                  <Typography variant="h4">{metrics.lowStockItems}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requieren atención
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Typography variant="h6">Movimientos</Typography>
                  </Box>
                  <Typography variant="h4">{metrics.pendingMovements}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts and Alerts Section */}
          <Grid container spacing={3}>
            {/* Stock Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Tendencias de Stock
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stock" stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Alerts Section */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Alertas Activas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockAlerts.map((alert) => (
                    <Card key={alert.id} className={`alert-card ${alert.type}`}>
                      <CardContent>
                        <Typography variant="subtitle2" color="inherit">
                          {alert.message}
                        </Typography>
                        <Typography variant="body2" color="inherit">
                          Ubicación: {alert.location}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
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

const InventarioDashboard: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <InventarioDashboardContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default InventarioDashboard; 