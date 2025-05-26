import React, { useState, useEffect } from 'react';
import Navbar from '../../../pages/navbar/Navbar';
import { Box, Paper, Typography, TextField, Button, Grid, Card, CardContent, MenuItem, IconButton, Tooltip, } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Download as DownloadIcon, FilterList as FilterListIcon, TryTwoTone } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { Transporte } from '../../../types/types';
import HistorialService from './service/Historial.service';
import { MultiSelect } from 'react-multi-select-component';
// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Función para formatear el estado
const formatearEstado = (estado: string): string => {
    const estados: { [key: string]: string } = {
        'NUEVO': 'Nuevo',
        'CARGANDO': 'Cargando',
        'CARGADO': 'Cargado',
        'DESCARGADO': 'Descargado',
        'COMPLETADO': 'Completado',
        'CANCELADO': 'Cancelado',
        'ARRIBADO': 'Arribado'
    };
    return estados[estado] || estado;
};

// Tipos para filtros y estados
interface EstadoOption { label: string; value: string; }
interface Filtros {
    fechaInicio: string;
    fechaFin: string;
    mes: string;
    estados: EstadoOption[];
    conductor: string;
}

const HistorialTransporte: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [transportes, setTransportes] = useState<Transporte[]>([]);
    const [filteredTransportes, setFilteredTransportes] = useState<Transporte[]>([]);
    const [filtros, setFiltros] = useState<Filtros>({
        fechaInicio: '',
        fechaFin: '',
        mes: '',
        estados: [],
        conductor: '',
    });

    const meses = [
        { label: 'Enero', value: '01' },
        { label: 'Febrero', value: '02' },
        { label: 'Marzo', value: '03' },
        { label: 'Abril', value: '04' },
        { label: 'Mayo', value: '05' },
        { label: 'Junio', value: '06' },
        { label: 'Julio', value: '07' },
        { label: 'Agosto', value: '08' },
        { label: 'Septiembre', value: '09' },
        { label: 'Octubre', value: '10' },
        { label: 'Noviembre', value: '11' },
        { label: 'Diciembre', value: '12' },
    ];
    const estadosOptions = [
        { label: 'Nuevo', value: 'NUEVO' },
        { label: 'Cargando', value: 'CARGANDO' },
        { label: 'Cargado', value: 'CARGADO' },
        { label: 'Descargado', value: 'DESCARGADO' },
        { label: 'Completado', value: 'COMPLETADO' },
        { label: 'Cancelado', value: 'CANCELADO' },
        { label: 'Arribado', value: 'ARRIBADO' },
    ];

    // Función para calcular datos del gráfico de estados
    const calcularDatosEstados = () => {
        const conteoEstados = filteredTransportes.reduce((acc, transporte) => {
            const estado = formatearEstado(transporte.estado);
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(conteoEstados).map(([name, value]) => ({
            name,
            value
        }));
    };

    // Función para calcular datos del gráfico mensual
    const calcularDatosMensuales = () => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const conteoMensual = filteredTransportes.reduce((acc, transporte) => {
            const fecha = new Date(transporte.fecha_creacion);
            const mes = meses[fecha.getMonth()];
            acc[mes] = (acc[mes] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return meses.map(mes => ({
            mes,
            transportes: conteoMensual[mes] || 0
        }));
    };

    // Gráfico de líneas de tendencia mensual
    const calcularTendenciaMensual = () => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const completadosPorMes: { [key: string]: number } = {};
        const canceladosPorMes: { [key: string]: number } = {};
        filteredTransportes.forEach(t => {
            const fecha = new Date(t.fecha_creacion);
            const mes = meses[fecha.getMonth()];
            if (t.estado === 'COMPLETADO') {
                completadosPorMes[mes] = (completadosPorMes[mes] || 0) + 1;
            }
            if (t.estado === 'CANCELADO') {
                canceladosPorMes[mes] = (canceladosPorMes[mes] || 0) + 1;
            }
        });
        return meses.map(mes => ({
            mes,
            Completados: completadosPorMes[mes] || 0,
            Cancelados: canceladosPorMes[mes] || 0
        }));
    };

    const columnas: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'identificador', headerName: 'Identificador', width: 130 },
        { field: 'fecha_creacion', headerName: 'Fecha', width: 130 },
        { field: 'hora_creacion', headerName: 'Hora', width: 100 },
        { field: 'almacen_origen_nombre', headerName: 'Origen', width: 150 },
        { field: 'almacen_destino_nombre', headerName: 'Destino', width: 150 },
        { 
            field: 'estado', 
            headerName: 'Estado', 
            width: 130,
            renderCell: (params) => formatearEstado(params.value)
        },
        { field: 'conductor_nombre', headerName: 'Conductor', width: 150 },
        { field: 'conductor_cedula', headerName: 'Cédula', width: 120 },
        { field: 'vehiculo_marca', headerName: 'Marca', width: 120 },
        { field: 'vehiculo_placa', headerName: 'Placa', width: 120 },
    ];

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = event.target as HTMLInputElement;
        setFiltros(prev => ({ ...prev, [name as string]: value }));
    };

    const handleEstadosChange = (selected: EstadoOption[]) => {
        setFiltros(prev => ({ ...prev, estados: selected }));
    };

    const limpiarFiltros = () => {
        setFiltros({ fechaInicio: '', fechaFin: '', mes: '', estados: [], conductor: '' });
        setFilteredTransportes(transportes);
    };

    const aplicarFiltros = () => {
        let filtrados = [...transportes];
        // Filtro por fecha de inicio
        if (filtros.fechaInicio) {
            filtrados = filtrados.filter(t => {
                const fechaT = new Date(t.fecha_creacion);
                const fechaInicio = new Date(filtros.fechaInicio);
                return fechaT >= fechaInicio;
            });
        }
        // Filtro por fecha de fin
        if (filtros.fechaFin) {
            filtrados = filtrados.filter(t => {
                const fechaT = new Date(t.fecha_creacion);
                const fechaFin = new Date(filtros.fechaFin);
                return fechaT <= fechaFin;
            });
        }
        // Filtro por mes
        if (filtros.mes) {
            filtrados = filtrados.filter(t => {
                const mesT = (new Date(t.fecha_creacion).getMonth() + 1).toString().padStart(2, '0');
                return mesT === filtros.mes;
            });
        }
        // Filtro por estados (MultiSelect)
        if (filtros.estados.length > 0) {
            const estadosSel = filtros.estados.map(e => e.value);
            filtrados = filtrados.filter(t => estadosSel.includes(t.estado));
        }
        // Filtro por conductor
        if (filtros.conductor) {
            filtrados = filtrados.filter(t => 
                (t.conductor_nombre && t.conductor_nombre.toLowerCase().includes(filtros.conductor.toLowerCase())) ||
                (t.conductor_cedula && t.conductor_cedula.includes(filtros.conductor))
            );
        }
        setFilteredTransportes(filtrados);
    };

    const exportarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTransportes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial Transportes');
        XLSX.writeFile(workbook, 'historial_transportes.xlsx');
    };

    // Obtiene los datos de la tabla 
    const setHistorial = async () => {
        try {
            const historial = await HistorialService.getHistorial();
            setTransportes(historial.data);
            setFilteredTransportes(historial.data);
        } catch (error) {
            console.error('Error al obtener el historial de transportes:', error);
        }
    }
    useEffect(() => {
        setHistorial();
    }, []);

    // Indicadores rápidos
    const total = filteredTransportes.length;
    const completados = filteredTransportes.filter(t => t.estado === 'COMPLETADO').length;
    const cancelados = filteredTransportes.filter(t => t.estado === 'CANCELADO').length;
    const enProceso = filteredTransportes.filter(t => ['CARGANDO','CARGADO','DESCARGADO','ARRIBADO'].includes(t.estado)).length;
    const porcentajeCumplimiento = total > 0 ? Math.round((completados / total) * 100) : 0;

    // Indicador: promedio de transportes por mes
    const promedioPorMes = (() => {
        const mesesUnicos = new Set(filteredTransportes.map(t => new Date(t.fecha_creacion).getMonth()));
        return mesesUnicos.size > 0 ? Math.round(filteredTransportes.length / mesesUnicos.size) : 0;
    })();

    return (
        <div >
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Historial de Transportes
                    </Typography>

                    {/* Filtros */}
                    <Paper className="filtros-panel" sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    name="fechaInicio"
                                    label="Fecha Inicio"
                                    value={filtros.fechaInicio}
                                    onChange={handleFiltroChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    name="fechaFin"
                                    label="Fecha Fin"
                                    value={filtros.fechaFin}
                                    onChange={handleFiltroChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    select
                                    name="mes"
                                    label="Mes"
                                    value={filtros.mes}
                                    onChange={handleFiltroChange}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {meses.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <div className="multi-select">
                                    <MultiSelect
                                        options={estadosOptions}
                                        value={filtros.estados}
                                        onChange={handleEstadosChange}
                                        labelledBy="Seleccionar estados"
                                        overrideStrings={{ selectSomeItems: "Estados..." }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    name="conductor"
                                    label="Conductor (Nombre o Cédula)"
                                    value={filtros.conductor}
                                    onChange={handleFiltroChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<FilterListIcon />}
                                    onClick={aplicarFiltros}
                                    sx={{ mr: 1 }}
                                    color="primary"
                                >
                                    Aplicar Filtros
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={limpiarFiltros}
                                    sx={{ mr: 1 }}
                                >
                                    Limpiar Filtros
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportarExcel}
                                >
                                    Exportar a Excel
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Indicadores rápidos */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ bgcolor: '#e6f9f6', color: '#00bfa6', textAlign: 'center', p: 2 }}>
                                <Typography variant="h6">Total Transportes</Typography>
                                <Typography variant="h4">{total}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ bgcolor: '#e0fbe6', color: '#2ecc40', textAlign: 'center', p: 2 }}>
                                <Typography variant="h6">Completados</Typography>
                                <Typography variant="h4">{completados}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ bgcolor: '#ffe6e6', color: '#e74c3c', textAlign: 'center', p: 2 }}>
                                <Typography variant="h6">Cancelados</Typography>
                                <Typography variant="h4">{cancelados}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ bgcolor: '#fffbe6', color: '#f1c40f', textAlign: 'center', p: 2 }}>
                                <Typography variant="h6">En Proceso</Typography>
                                <Typography variant="h4">{enProceso}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: '#e6f9f6', color: '#00bfa6', textAlign: 'center', p: 2 }}>
                                <Typography variant="h6">% Cumplimiento</Typography>
                                <Typography variant="h3">{porcentajeCumplimiento}%</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: '#e6f9f6', color: '#00bfa6', textAlign: 'center', p: 2 }}>
                                <Typography variant="h6">Promedio por Mes</Typography>
                                <Typography variant="h3">{promedioPorMes}</Typography>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Gráficos */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Distribución por Estado
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <PieChart width={500} height={300}>
                                            <Pie
                                                data={calcularDatosEstados()}
                                                cx={270}
                                                cy={150}
                                                labelLine={false}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {calcularDatosEstados().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Transportes por Mes
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <BarChart
                                            width={400}
                                            height={300}
                                            data={calcularDatosMensuales()}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar dataKey="transportes" fill="#8884d8" />
                                        </BarChart>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tendencia Mensual (Completados vs Cancelados)
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <LineChart width={700} height={300} data={calcularTendenciaMensual()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="Completados" stroke="#2ecc40" strokeWidth={3} />
                                            <Line type="monotone" dataKey="Cancelados" stroke="#e74c3c" strokeWidth={3} />
                                        </LineChart>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabla de datos */}
                    <Paper sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={filteredTransportes}
                            columns={columnas}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </Paper>
                </Box>
            </div>
        </div>
    );
};

export default HistorialTransporte;
