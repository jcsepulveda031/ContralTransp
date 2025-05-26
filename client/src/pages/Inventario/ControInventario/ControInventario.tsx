import React, { useState, useEffect } from 'react';
import Navbar from '../../navbar/Navbar';
import { AuthProvider } from '../../../context/AuthContext';
import { useAuth } from '../../../context/AuthContext';
import { NotificationProvider, useNotification } from '../../../context/NotificationContext';
import ErrorHandler from '../../../components/ErrorHandler/ErrorHandler';
import {
    Box, Container, Grid, Paper, Typography, Button,
    Card, CardContent, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select,
    MenuItem, FormControl,
    InputLabel,
    useTheme,
    useMediaQuery,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    Badge,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
} from '@mui/material';
import { LocationOn as LocationIcon, SwapHoriz as SwapIcon, Add as AddIcon,
        ExpandMore as ExpandMoreIcon, FilterList as FilterIcon,  DragIndicator as DragIcon, Inventory as InventoryIcon,
        LocalShipping as LocalShippingIcon, 
        CookieSharp} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import {  LocationWithDetails, Ubicacion,
    LoadingZoneState,
    FilterState,
    MovimientoStock,
    ZonaCargaUnidad,
    UnidadLogistica
} from '../../../types/types';
import './styles/ControInventario.css';
import InventarioService from './services/Inventario.service';
import MoveToLoadingZoneModal from './Modal/MoveToLoadingZoneModal';

// Mock data
const mockUnidadesLogisticas: UnidadLogistica[] = [
    {
        id: 1,
        tipo: 'CAJA',
        codigo: 'CAJA001',
        sku: 'SKU001',
        cantidad: 50,
        peso: 10.5,
        volumen: 0.5,
        dimensiones: '30x20x15',
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 2,
        tipo: 'PALLET',
        codigo: 'PALLET001',
        sku: 'SKU002',
        cantidad: 100,
        peso: 500.0,
        volumen: 1.2,
        dimensiones: '120x100x150',
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 3,
        tipo: 'UA',
        codigo: 'UA001',
        sku: 'SKU003',
        cantidad: 25,
        peso: 25.0,
        volumen: 0.3,
        dimensiones: '40x30x20',
        fecha_creacion: new Date().toISOString()
    }
];

const mockUbicaciones: LocationWithDetails[] = [
    {
        id: 1,
        almacen_id: 1,
        columna: 'A',
        posicion: 'P1',
        nivel: '1',
        tipo: 'picking',
        capacidad: 100,
        stock_actual: 75,
        estado: 'activo',
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        unidades: [
            {
                id: 1,
                ubicacion_id: 1,
                unidad_id: 1,
                cantidad: 50,
                fecha_creacion: new Date().toISOString(),
                fecha_actualizacion: new Date().toISOString(),
                unidad: mockUnidadesLogisticas[0]
            },
            {
                id: 2,
                ubicacion_id: 1,
                unidad_id: 2,
                cantidad: 25,
                fecha_creacion: new Date().toISOString(),
                fecha_actualizacion: new Date().toISOString(),
                unidad: mockUnidadesLogisticas[1]
            }
        ]
    },
    {
        id: 2,
        almacen_id: 1,
        columna: 'A',
        posicion: 'A1',
        nivel: '1',
        tipo: 'alternate',
        capacidad: 150,
        stock_actual: 120,
        estado: 'activo',
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        unidades: [
            {
                id: 3,
                ubicacion_id: 2,
                unidad_id: 3,
                cantidad: 120,
                fecha_creacion: new Date().toISOString(),
                fecha_actualizacion: new Date().toISOString(),
                unidad: mockUnidadesLogisticas[2]
            }
        ]
    },
    {
        id: 3,
        almacen_id: 1,
        columna: 'B',
        posicion: 'P1',
        nivel: '2',
        tipo: 'picking',
        capacidad: 80,
        stock_actual: 0,
        estado: 'activo',
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        unidades: []
    }
];

const mockZonaCarga: LoadingZoneState = {
    id: 'LZ1',
    name: 'Zona de Carga',
    stock_actual: 25,
    capacidad: 100,
    unidades: [
        {
            id: 1,
            unidad_id: 1,
            estado: 'PREPARADA',
            fecha_ingreso: new Date().toISOString(),
            user_id: 1,
            almacen_id: 1,
            unidad: mockUnidadesLogisticas[0]
        }
    ]
};

interface ErrorState {
    open: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
}

// Helper to map Ubicacion[] to LocationWithDetails[]
function mapUbicacionesToLocationWithDetails(ubicaciones: any[]): LocationWithDetails[] {
    return ubicaciones.map((u) => ({
        id: Number(u.id),
        almacen_id: Number(u.almacen_id),
        columna: u.columna,
        posicion: u.posicion,
        nivel: u.nivel,
        tipo: u.tipo,
        capacidad: Number(u.capacidad),
        stock_actual: Number(u.stock_actual),
        estado: u.estado,
        fecha_creacion: u.fecha_creacion,
        fecha_actualizacion: u.fecha_actualizacion,
        unidades: (u.unidades || []).map((unidad: any) => ({
            id: Number(unidad.id),
            ubicacion_id: Number(unidad.ubicacion_id),
            unidad_id: Number(unidad.unidad_id),
            cantidad: Number(unidad.cantidad),
            fecha_creacion: unidad.fecha_creacion,
            fecha_actualizacion: unidad.fecha_actualizacion,
            unidad: {
                id: Number(unidad.unidad.id),
                tipo: unidad.unidad.tipo,
                codigo: unidad.unidad.codigo,
                sku: unidad.unidad.sku,
                cantidad: unidad.unidad.cantidad !== null ? Number(unidad.unidad.cantidad) : null,
                peso: unidad.unidad.peso !== null ? Number(unidad.unidad.peso) : null,
                volumen: unidad.unidad.volumen !== null ? Number(unidad.unidad.volumen) : null,
                dimensiones: unidad.unidad.dimensiones,
                fecha_creacion: unidad.unidad.fecha_creacion,
            }
        }))
        }));
    }

const ControInventarioContent: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<LocationWithDetails | null>(null);
    const [movementDialog, setMovementDialog] = useState(false);
    const [movement, setMovement] = useState<Partial<MovimientoStock>>({
        ubicacion_origen_id: undefined,
        ubicacion_destino_id: undefined,
        unidad_id: undefined,
        cantidad: 0,
        tipo_movimiento: 'transferencia'
    });
    const [filters, setFilters] = useState<FilterState>({
        columna: null,
        nivel: null,
        estado: null,
    });
    const [loadingZone, setLoadingZone] = useState<LoadingZoneState>({
        id: 'LZ1',
        name: 'Zona de Carga',
        stock_actual: 0,
        capacidad: 100,
        unidades: []
    });
    const { user } = useAuth();
    const [ubicaciones, setUbicaciones] = useState<LocationWithDetails[]>([]);
    const { showNotification } = useNotification();
    const [showMoveToLoadingZoneModal, setShowMoveToLoadingZoneModal] = useState(false);
    const [showMoveFromLoadingZoneModal, setShowMoveFromLoadingZoneModal] = useState(false);
    const [selectedZonaUnidad, setSelectedZonaUnidad] = useState<ZonaCargaUnidad & { unidad: UnidadLogistica } | null>(null);
    const [selectedDestinoId, setSelectedDestinoId] = useState<number | null>(null);
    const [cantidadAMover, setCantidadAMover] = useState<number>(1);
    const [selectedColumna, setSelectedColumna] = useState<string>('');
    const [selectedPosicion, setSelectedPosicion] = useState<string>('');
    const [selectedNivel, setSelectedNivel] = useState<string>('');
    const [capacidadError, setCapacidadError] = useState<string>('');
    const [showFilterDialog, setShowFilterDialog] = useState(false);
    const [tempFilters, setTempFilters] = useState<FilterState>(filters);
    const [movementToLocation, setMovementToLocation] = useState<{ unidad_id: number | undefined; cantidad: number; destino: string }>({
        unidad_id: undefined,
        cantidad: 0,
        destino: ''
    });
    const [activeMoveTab, setActiveMoveTab] = useState<'zonaCarga' | 'ubicacion' | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            
            const response = await InventarioService.getPickingLocations('9');
            if (response.status) { 
                setUbicaciones(mapUbicacionesToLocationWithDetails(response.data));
            }else{
                setUbicaciones(mockUbicaciones);
            }
            const responseZonaCarga = await InventarioService.getZonaCarga('9');
            if(responseZonaCarga.status){
                setLoadingZone(responseZonaCarga.data);
            }else{
                setLoadingZone(mockZonaCarga);
            }
        } catch (err) {
            showNotification('error', 'Error al cargar los datos del inventario');
        } finally {
            
        }
    };
    const toggleNavbar = () => setIsOpen(!isOpen);

    const handleLocationClick = (location: LocationWithDetails) => {
        setSelectedLocation(location);
        setMovementDialog(true);
    };

    const handleError = (message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'error') => {
        showNotification(severity, message);
    };

    const handleCloseError = () => {
        showNotification('success', 'Error cerrado');
    };

    const handleMovementSubmit = async () => {

        if (!movement.unidad_id || !movement.cantidad) {
            showNotification('warning', 'Por favor complete todos los campos requeridos');
            return;
        }

        // Asigna los ids correctamente antes de enviar
        const movimientoCompleto = {
            ...movement,
            ubicacion_origen_id: selectedLocation?.id,
            ubicacion_destino_id: 0, // O el id real de la zona de carga si aplica
            tipo_movimiento: 'transferencia',
            user_id: user?.id ?? 0,
            almacen_id: 9,
            id_ubicacion: selectedLocation?.unidades.find(u => u.unidad_id === movement.unidad_id)?.id
        };

        try {
            // Validar que la cantidad no supere la cantidad disponible de la unidad seleccionada
            const unidadSeleccionada = selectedLocation?.unidades.find(u => u.unidad_id === movement.unidad_id);
            if (!unidadSeleccionada) {
                showNotification('error', 'No se encontró la unidad seleccionada');
                return;
            }
            console.log("unidadSeleccionada", unidadSeleccionada);
            if (movement.cantidad > unidadSeleccionada.cantidad) {
                showNotification('error', `La cantidad a mover (${movement.cantidad}) no puede superar la cantidad disponible (${unidadSeleccionada.cantidad})`);
                return;
            }


            const response = await InventarioService.moveToPickingLocationZone( movimientoCompleto);
            if (response.status) {
                showNotification('success', 'Movimiento realizado con éxito');
                await loadData();
                setMovementDialog(false);
            } else {
                showNotification('error', response.error || 'Error al mover la unidad a la ubicación');
            }
        } catch (error) {
            showNotification('error', 'Error al mover la unidad a la ubicación');
        }
    };
    const handleMoveToLocationSubmit = async () => {
        if (!movementToLocation.unidad_id || !movementToLocation.cantidad || movementToLocation.cantidad <= 0 || !movementToLocation.destino) {
            showNotification('warning', 'Por favor complete todos los campos requeridos');
            return;
        }
        // Construir el objeto movimientoCompleto
        const movimientoCompleto = {
            id: selectedLocation?.id,
            id_ubicacion: selectedLocation?.unidades.find(u => u.unidad_id === movementToLocation.unidad_id)?.id,
            ubicacion_origen_id: selectedLocation?.id,
            ubicacion_destino_id: Number(movementToLocation.destino),
            unidad_id: movementToLocation.unidad_id,
            cantidad: movementToLocation.cantidad,
            tipo_movimiento: 'transferencia'
        };
        try {
            console.log("movimientoCompleto", movimientoCompleto);
            // Validar que la cantidad no supere la cantidad disponible de la unidad seleccionada
            const unidadSeleccionada = selectedLocation?.unidades.find(u => u.unidad_id === movementToLocation.unidad_id);
            if (!unidadSeleccionada) {
                showNotification('error', 'No se encontró la unidad seleccionada');
                return;
            }

            if (movementToLocation.cantidad > unidadSeleccionada.cantidad) {
                showNotification('error', `La cantidad a mover (${movementToLocation.cantidad}) no puede superar la cantidad disponible (${unidadSeleccionada.cantidad})`);
                return;
            }

            // Validar capacidad de ubicación destino
            const ubicacionDestino = ubicaciones.find(u => u.id === Number(movementToLocation.destino));
            if (!ubicacionDestino) {
                showNotification('error', 'No se encontró la ubicación destino');
                return;
            }
            console.log("ubicacionDestino", ubicacionDestino);
            const espacioDisponible = ubicacionDestino.capacidad - ubicacionDestino.stock_actual;
            if (movementToLocation.cantidad > espacioDisponible) {
                showNotification('error', `La ubicación destino no tiene suficiente espacio. Espacio disponible: ${espacioDisponible}`);
                return;
            }
            const response = await InventarioService.createMovimientoStock(movimientoCompleto);
            if(response.status){
                showNotification('success', 'Movimiento realizado con éxito');
                setMovementDialog(false);
                loadData();
            }else{
                showNotification('error', response.error || 'Error al realizar el movimiento');
            }
        } catch (error) {
            showNotification('error', 'Error al realizar el movimiento');
        }
    };
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        try {
            const { source, destination } = result;
            // Validar el movimiento
            const sourceLocation = ubicaciones.find(u => u.id.toString() === source.droppableId.split('-')[1]);
            const destLocation = ubicaciones.find(u => u.id.toString() === destination.droppableId.split('-')[1]);

            if (!sourceLocation || !destLocation) {
                showNotification('error', 'Ubicación no encontrada');
                return;
            }

            // TODO: Implement drag and drop logic with API
            console.log('Drag from:', source, 'to:', destination);
            showNotification('success', 'Movimiento realizado con éxito');
        } catch (error) {
            showNotification('error', 'Error al realizar el movimiento');
        }
    };

    const getLocationStatus = (location: LocationWithDetails) => {
        const percentage = (location.stock_actual / location.capacidad) * 100;
        if (percentage === 0) return 'empty';
        if (percentage >= 90) return 'full';
        return 'partial';
    };

    const renderPickingLocation = (location: LocationWithDetails) => {
        const status = getLocationStatus(location);
        return (
            <Draggable key={location.id} draggableId={location.id.toString()} index={location.id}>
                {(provided: DraggableProvided) => (
                    <Card 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`picking-location-card ${location.tipo}`}
                        onClick={() => handleLocationClick(location)}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            mb: 2,
                            borderLeft: location.tipo === 'picking' ? '5px solid #2196f3' : '5px solid #43a047',
                            background: '#fafdff',
                            transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                boxShadow: 6,
                                borderColor: '#1976d2',
                                transform: 'scale(1.015)'
                            }
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} component="div" role="presentation">
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#223354' }}>{`${location.columna}${location.posicion}-${location.nivel}`}</Typography>
                                <Chip 
                                    label={`${location.stock_actual}/${location.capacidad}`}
                                    color={status === 'full' ? 'error' : status === 'partial' ? 'warning' : 'success'}
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {location.tipo === 'picking' ? 'Picking' : 'Alterna'} | Nivel {location.nivel}
                            </Typography>
                            <Box component="div" sx={{ mt: 2 }}>
                                <div className="stock-bar">
                                    <div 
                                        className={`stock-fill ${status === 'partial' ? 'warning' : status === 'full' ? 'danger' : ''}`}
                                        style={{ width: `${(location.stock_actual / location.capacidad) * 100}%` }}
                                    />
                                </div>
                            </Box>
                            <div className={`location-status ${status}`} />
                            <div {...provided.dragHandleProps} className="drag-handle">
                                <DragIcon />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </Draggable>
        );
    };

    const renderColumn = (columna: string) => {
        const columnLocations = ubicaciones
            .filter(loc => loc.columna === columna)
            .filter(loc => !filters.nivel || loc.nivel === filters.nivel)
            .filter(loc => !filters.estado || getLocationStatus(loc) === filters.estado);

        // Group locations by type and level
        const pickingLocationsByLevel = columnLocations
            .filter(loc => loc.tipo === 'picking')
            .reduce((acc, loc) => {
                if (!acc[loc.nivel]) acc[loc.nivel] = [];
                acc[loc.nivel].push(loc);
                return acc;
            }, {} as Record<string, LocationWithDetails[]>);

        const alternateLocationsByLevel = columnLocations
            .filter(loc => loc.tipo === 'alternate')
            .reduce((acc, loc) => {
                if (!acc[loc.nivel]) acc[loc.nivel] = [];
                acc[loc.nivel].push(loc);
                return acc;
            }, {} as Record<string, LocationWithDetails[]>);

        return (
            <Paper key={columna} className="column-container" elevation={4} sx={{ mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" className="column-header" sx={{ mb: 2, fontWeight: 700, fontSize: '1.2rem', color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                    <LocationIcon color="primary" sx={{ mr: 1 }} />
                    Columna {columna}
                </Typography>
                <Droppable droppableId={`column-${columna}`}>
                    {(provided: DroppableProvided) => (
                        <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="locations-grid"
                        >
                            {/* Picking Locations */}
                            <Accordion defaultExpanded className="location-type-accordion" sx={{ mb: 2, borderRadius: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ fontWeight: 600 }}>Ubicaciones Picking</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {Object.entries(pickingLocationsByLevel).map(([nivel, locations]) => (
                                        <Accordion key={`picking-${nivel}`} className="level-accordion" sx={{ mb: 1, borderRadius: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontWeight: 500 }}>Nivel {nivel}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box component="div" className="levels-container">
                                                    {locations.map(renderPickingLocation)}
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>

                            {/* Alternate Locations */}
                            <Accordion defaultExpanded className="location-type-accordion" sx={{ mb: 2, borderRadius: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ fontWeight: 600 }}>Ubicaciones Alternas</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {Object.entries(alternateLocationsByLevel).map(([nivel, locations]) => (
                                        <Accordion key={`alternate-${nivel}`} className="level-accordion" sx={{ mb: 1, borderRadius: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontWeight: 500 }}>Nivel {nivel}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box component="div" className="levels-container">
                                                    {locations.map(renderPickingLocation)}
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Paper>
        );
    };

    const renderFilters = () => {
        const columnas: string[] = Array.from(new Set(ubicaciones.map(u => u.columna).filter((c): c is string => typeof c === 'string')));
        const niveles: string[] = tempFilters.columna
            ? Array.from(new Set(ubicaciones.filter(u => u.columna === tempFilters.columna).map(u => u.nivel).filter((n): n is string => typeof n === 'string')))
            : [];
        const estados = ['empty', 'partial', 'full'];

        return (
            <Box component="div" className="filter-container">
                <Chip
                    icon={<FilterIcon />}
                    label="Filtros"
                    className="filter-chip"
                    onClick={() => {
                        setTempFilters(filters);
                        setShowFilterDialog(true);
                    }}
                />
                {filters.columna && (
                    <Chip
                        label={`Columna ${filters.columna}`}
                        onDelete={() => setFilters(prev => ({ ...prev, columna: null }))}
                    />
                )}
                {filters.nivel && (
                    <Chip
                        label={`Nivel ${filters.nivel}`}
                        onDelete={() => setFilters(prev => ({ ...prev, nivel: null }))}
                    />
                )}
                {filters.estado && (
                    <Chip
                        label={`Estado: ${filters.estado}`}
                        onDelete={() => setFilters(prev => ({ ...prev, estado: null }))}
                    />
                )}

                <Dialog open={showFilterDialog} onClose={() => setShowFilterDialog(false)}>
                    <DialogTitle>Filtrar Ubicaciones</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Columna</InputLabel>
                            <Select
                                value={tempFilters.columna || ''}
                                onChange={e => {
                                    setTempFilters(f => ({
                                        ...f,
                                        columna: e.target.value,
                                        nivel: null // reset nivel si cambia columna
                                    }));
                                }}
                                label="Columna"
                            >
                                {columnas.map(col => (
                                    <MenuItem key={col} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }} disabled={!tempFilters.columna}>
                            <InputLabel>Nivel</InputLabel>
                            <Select
                                value={tempFilters.nivel || ''}
                                onChange={e => setTempFilters(f => ({ ...f, nivel: e.target.value }))}
                                label="Nivel"
                            >
                                {niveles.map(niv => (
                                    <MenuItem key={niv} value={niv}>{niv}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={tempFilters.estado || ''}
                                onChange={e => setTempFilters(f => ({ ...f, estado: (e.target.value === '' ? null : e.target.value as 'empty' | 'partial' | 'full') }))}
                                label="Estado"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="empty">Vacío</MenuItem>
                                <MenuItem value="partial">Parcial</MenuItem>
                                <MenuItem value="full">Lleno</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowFilterDialog(false)}>Cancelar</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setFilters(tempFilters);
                                setShowFilterDialog(false);
                            }}
                        >
                            Aplicar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    };

    const handleMoveToLoadingZone = async (unidadId: number, cantidad: number) => {
        try {
            const response = await InventarioService.moveToLoadingZone(unidadId, cantidad);
            if (response.status) {
                showNotification('success', 'Unidad movida a zona de carga exitosamente');
                // Refresh data
                const [ubicacionesResponse, zonaCargaResponse] = await Promise.all([
                    InventarioService.getPickingLocations('9'),
                    InventarioService.getZonaCarga('9')
                ]);
                if (ubicacionesResponse.status) {
                    setUbicaciones(mapUbicacionesToLocationWithDetails(ubicacionesResponse.data));
                }
                if (zonaCargaResponse.status) {
                    setLoadingZone(zonaCargaResponse.data);
                }
            } else {
                throw new Error(response.message || 'Error al mover la unidad');
            }
        } catch (error) {
            showNotification('error', 'Error al mover la unidad a la zona de carga');
            throw error;
        }
    };

    const handleOpenMoveFromLoadingZone = (zonaUnidad: ZonaCargaUnidad & { unidad: UnidadLogistica }) => {
        setSelectedZonaUnidad(zonaUnidad);
        setCantidadAMover(1);
        setSelectedColumna('');
        setSelectedPosicion('');
        setSelectedNivel('');
        setCapacidadError('');
        setShowMoveFromLoadingZoneModal(true);
    };

    const handleMoveFromLoadingZone = async () => {
        const ubicacionDestino = ubicaciones.find(
            u => u.columna === selectedColumna && u.nivel === selectedNivel && u.posicion === selectedPosicion
        );
        if (!selectedZonaUnidad || !ubicacionDestino || cantidadAMover <= 0) return;
        if (ubicacionDestino.stock_actual + cantidadAMover > ubicacionDestino.capacidad) {
            setCapacidadError('La cantidad supera la capacidad de la ubicación seleccionada. Elija otra ubicación o reduzca la cantidad.');
            return;
        }
        try{
            const response = await InventarioService.moveToPickingLocation(selectedZonaUnidad.unidad.id, cantidadAMover, ubicacionDestino.id,selectedZonaUnidad.id);
            if (response.status) {
                showNotification('success', 'Unidad movida a ubicación exitosamente');
                
            } else {
                showNotification('error', 'Error al mover la unidad a la ubicación');
            }

        // 1. Restar cantidad de la zona de carga
        setLoadingZone(prev => ({
            ...prev,
            unidades: prev.unidades.map(u =>
                u.id === selectedZonaUnidad.id
                    ? { ...u, unidad: { ...u.unidad, cantidad: (u.unidad.cantidad ?? 0) - cantidadAMover } }
                    : u
            )
        }));
        // 2. Sumar cantidad a la ubicación destino
        setUbicaciones(prev => prev.map(ubic =>
            ubic.id === ubicacionDestino.id
                ? {
                    ...ubic,
                    unidades: [
                        ...ubic.unidades,
                        {
                            id: Date.now(), // id temporal
                            ubicacion_id: ubic.id,
                            unidad_id: selectedZonaUnidad.unidad.id,
                            cantidad: cantidadAMover,
                            fecha_creacion: new Date().toISOString(),
                            fecha_actualizacion: new Date().toISOString(),
                            unidad: selectedZonaUnidad.unidad
                        }
                    ],
                    stock_actual: ubic.stock_actual + cantidadAMover
                }
                : ubic
        ));


        setShowMoveFromLoadingZoneModal(false);
        setSelectedColumna('');
        setSelectedPosicion('');
        setSelectedNivel('');
        setCantidadAMover(1);
        setSelectedZonaUnidad(null);
        setCapacidadError('');
        } catch (error) {
            showNotification('error', 'Error al mover la unidad a la ubicación');
        }
    };

    const renderProcesos = (): React.JSX.Element => {
        const columnas: string[] = Array.from(new Set(ubicaciones.map(loc => loc.columna)));
        const niveles = selectedColumna
            ? Array.from(new Set(ubicaciones.filter(u => u.columna === selectedColumna).map(u => u.nivel)))
            : [];
        const posiciones = selectedColumna && selectedNivel
            ? Array.from(new Set(ubicaciones.filter(u => u.columna === selectedColumna && u.nivel === selectedNivel).map(u => u.posicion)))
            : [];

        const ubicacionDestino = ubicaciones.find(
            u => u.columna === selectedColumna && u.nivel === selectedNivel && u.posicion === selectedPosicion
        );

        return (
            <Container maxWidth="xl" className="stock-control">
                <Box component="div" sx={{ textAlign: 'center', mt: 2, mb: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: '#16181b',
                            letterSpacing: 1,
                            mb: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <InventoryIcon sx={{ fontSize: 40, color: '#16181b', mr: 1 }} />
                        Control de Stock por Ubicación
                    </Typography>
                    <Box component="div"
                        sx={{
                            width: 80,
                            height: 4,
                            background: 'linear-gradient(90deg, #1976d2 0%, #43a047 100%)',
                            borderRadius: 2,
                            mx: 'auto',
                            mb: 1,
                        }}
                    />
                    <Alert
                        severity="success"
                        icon={false}
                        sx={{
                            background: '#e8f5e9',
                            color: '#388e3c',
                            fontWeight: 500,
                            fontSize: '1.13rem',
                            textAlign: 'center',
                            borderRadius: 2,
                            mb: 3,
                            maxWidth: 700,
                            mx: 'auto',
                            py: 2,
                            px: 2,
                            boxShadow: '0 1px 6px rgba(67,160,71,0.08)'
                        }}
                    >
                        Gestiona y visualiza el inventario de tu almacén de forma eficiente.<br />
                        Mueve unidades entre ubicaciones y mantén el control total de tu stock.
                    </Alert>
                </Box>
                {renderFilters()}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Grid container spacing={3}>
                        {/* Picking Locations Visualization */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Ubicaciones de Picking
                                </Typography>
                                <Box component="div" className="columns-container">
                                    {columnas.map(renderColumn)}
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Loading Zone */}
                        <Grid item xs={12}>
                            <Paper className="loading-zone">
                                <Box component="div" className="loading-zone-header">
                                    <Typography variant="h6">
                                        Zona de Carga
                                    </Typography>
                                    <Badge badgeContent={loadingZone.unidades.length} color="primary">
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => setShowMoveToLoadingZoneModal(true)}
                                        >
                                            Agregar Unidades
                                        </Button>
                                    </Badge>
                                </Box>
                                <TableContainer>
                                    <Table className="loading-zone-table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="40px" />
                                                <TableCell>SKU</TableCell>
                                                <TableCell>Unidad</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingZone.unidades.map((zonaUnidad) => (
                                                <TableRow key={zonaUnidad.id}>
                                                    <TableCell>
                                                        <DragIcon className="drag-handle" />
                                                    </TableCell>
                                                    <TableCell>{zonaUnidad.unidad.sku}</TableCell>
                                                    <TableCell>{zonaUnidad.unidad.codigo}</TableCell>
                                                    <TableCell>{zonaUnidad.unidad.cantidad}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Mover a ubicación">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleOpenMoveFromLoadingZone(zonaUnidad)}
                                                            >
                                                                <SwapIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </DragDropContext>

                {/* Location Details Dialog */}
                <Dialog 
                    open={movementDialog} 
                    onClose={() => setMovementDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{
                        background: '#f5f6f8',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderBottom: '1px solid #e0e0e0',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#16181b',
                        px: 4,
                        py: 3
                    }}>
                        Detalles de Ubicación - {selectedLocation ? `${selectedLocation.columna}${selectedLocation.posicion}-${selectedLocation.nivel}` : ''}
                    </DialogTitle>
                    <DialogContent>
                        <Box component="div" sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                {/* Información General */}
                                <Grid item xs={12} md={6}>
                                    <Box component="div" sx={{
                                        background: '#f8f9fa',
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2,
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                                    }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                            <LocationIcon sx={{ mr: 1, color: '#1976d2' }} />
                                            Información General
                                        </Typography>
                                        <Typography variant="body1">Capacidad Total: <b>{selectedLocation?.capacidad}</b></Typography>
                                        <Typography variant="body1">Stock Actual: <b>{selectedLocation?.stock_actual}</b></Typography>
                                        <Typography variant="body1">Espacio Disponible: <b>{selectedLocation ? selectedLocation.capacidad - selectedLocation.stock_actual : 0}</b></Typography>
                                    </Box>
                                </Grid>
                                {/* Unidades en Ubicación */}
                                <Grid item xs={12} md={6}>
                                    <Box component="div" sx={{
                                        background: '#f8f9fa',
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2,
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                                    }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                            <LocalShippingIcon sx={{ mr: 1, color: '#43a047' }} />
                                            Unidades en Ubicación
                                        </Typography>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>SKU</TableCell>
                                                        <TableCell>Unidad</TableCell>
                                                        <TableCell>Cantidad</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedLocation?.unidades.map((ubicacionUnidad) => (
                                                        <TableRow key={ubicacionUnidad.id}>
                                                            <TableCell>{ubicacionUnidad.unidad.sku}</TableCell>
                                                            <TableCell>{ubicacionUnidad.unidad.codigo}</TableCell>
                                                            <TableCell>{ubicacionUnidad.cantidad ?? ubicacionUnidad.unidad.cantidad}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Botones para elegir el proceso de movimiento */}
                            <Box component="div" sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
                                <Button
                                    variant={activeMoveTab === 'zonaCarga' ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => {
                                        setActiveMoveTab('zonaCarga');
                                        setMovementToLocation({ unidad_id: undefined, cantidad: 0, destino: '' });
                                    }}
                                >
                                    Mover a Zona de Carga
                                </Button>
                                <Button
                                    variant={activeMoveTab === 'ubicacion' ? 'contained' : 'outlined'}
                                    color="success"
                                    onClick={() => {
                                        setActiveMoveTab('ubicacion');
                                        setMovement({
                                            ubicacion_origen_id: undefined,
                                            ubicacion_destino_id: undefined,
                                            unidad_id: undefined,
                                            cantidad: 0,
                                            tipo_movimiento: 'transferencia'
                                        });
                                    }}
                                >
                                    Mover a otra Ubicación
                                </Button>
                            </Box>

                            {/* Renderiza solo el formulario correspondiente */}
                            {activeMoveTab === 'zonaCarga' && (
                                <Box component="div" sx={{
                                    background: '#e3eafc',
                                    borderRadius: 2,
                                    p: 3,
                                    mb: 2,
                                    boxShadow: '0 1px 4px rgba(25,118,210,0.04)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                        <SwapIcon sx={{ mr: 1, color: '#1976d2' }} />
                                        Mover a Zona de Carga
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Unidad</InputLabel>
                                                <Select
                                                    value={movement.unidad_id?.toString() || ''}
                                                    onChange={(e) => setMovement({ ...movement, unidad_id: Number(e.target.value) })}
                                                    label="Unidad"
                                                >
                                                    {selectedLocation?.unidades.map((ubicacionUnidad) => (
                                                        <MenuItem key={ubicacionUnidad.unidad_id} value={ubicacionUnidad.unidad_id.toString()}>
                                                            {ubicacionUnidad.unidad.codigo} ({ubicacionUnidad.cantidad} disponibles)
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Cantidad a Mover"
                                                value={movement.cantidad || 0}
                                                onChange={(e) => setMovement({ ...movement, cantidad: Number(e.target.value) })}
                                                inputProps={{ min: 1, max: selectedLocation?.stock_actual }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                            {activeMoveTab === 'ubicacion' && (
                                <Box component="div" sx={{
                                    background: '#e8f5e9',
                                    borderRadius: 2,
                                    p: 3,
                                    mb: 2,
                                    boxShadow: '0 1px 4px rgba(67,160,71,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                        <SwapIcon sx={{ mr: 1, color: '#43a047' }} />
                                        Mover a otra Ubicación
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Unidad</InputLabel>
                                                <Select
                                                    value={movementToLocation.unidad_id?.toString() || ''}
                                                    onChange={(e) => setMovementToLocation({ ...movementToLocation, unidad_id: Number(e.target.value) })}
                                                    label="Unidad"
                                                >
                                                    {selectedLocation?.unidades.map((ubicacionUnidad) => (
                                                        <MenuItem key={ubicacionUnidad.unidad_id} value={ubicacionUnidad.unidad_id.toString()}>
                                                            {ubicacionUnidad.unidad.codigo} ({ubicacionUnidad.cantidad} disponibles)
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Cantidad a Mover"
                                                value={movementToLocation.cantidad || 0}
                                                onChange={(e) => setMovementToLocation({ ...movementToLocation, cantidad: Number(e.target.value) })}
                                                inputProps={{ min: 1, max: selectedLocation?.stock_actual }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Ubicación Destino</InputLabel>
                                                <Select
                                                    value={movementToLocation.destino || ''}
                                                    onChange={(e) => setMovementToLocation({ ...movementToLocation, destino: e.target.value })}
                                                    label="Ubicación Destino"
                                                >
                                                    {ubicaciones.filter(u => u.id !== selectedLocation?.id).map(u => (
                                                        <MenuItem key={u.id} value={u.id}>{`${u.columna}${u.posicion}-${u.nivel}`}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setMovementDialog(false)}>Cancelar</Button>
                        <Button
                            onClick={activeMoveTab === 'zonaCarga' ? handleMovementSubmit : handleMoveToLocationSubmit}
                            variant="contained"
                            disabled={
                                (activeMoveTab === 'zonaCarga' && (!movement.unidad_id || !movement.cantidad || movement.cantidad <= 0)) ||
                                (activeMoveTab === 'ubicacion' && (!movementToLocation.unidad_id || !movementToLocation.cantidad || movementToLocation.cantidad <= 0 || !movementToLocation.destino))
                            }
                        >
                            Confirmar Movimiento
                        </Button>
                    </DialogActions>
                </Dialog>

                <MoveToLoadingZoneModal
                    isOpen={showMoveToLoadingZoneModal}
                    onClose={() => setShowMoveToLoadingZoneModal(false)}
                    onConfirm={handleMoveToLoadingZone}
                    ubicaciones={ubicaciones}
                />

                <Dialog open={showMoveFromLoadingZoneModal} onClose={() => {
                    setShowMoveFromLoadingZoneModal(false);
                    setSelectedColumna('');
                    setSelectedPosicion('');
                    setSelectedNivel('');
                    setCantidadAMover(1);
                    setSelectedZonaUnidad(null);
                    setCapacidadError('');
                }}>
                    <DialogTitle>Mover unidad a ubicación</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Columna</InputLabel>
                            <Select
                                value={selectedColumna}
                                onChange={e => {
                                    setSelectedColumna(e.target.value);
                                    setSelectedNivel('');
                                    setSelectedPosicion('');
                                    setCapacidadError('');
                                }}
                                label="Columna"
                            >
                                {columnas.map(col => (
                                    <MenuItem key={col} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedColumna}>
                            <InputLabel>Ubicación</InputLabel>
                            <Select
                                value={selectedNivel}
                                onChange={e => {
                                    setSelectedNivel(e.target.value);
                                    setSelectedPosicion('');
                                    setCapacidadError('');
                                }}
                                label="Nivel"
                            >
                                {niveles.map(niv => (
                                    <MenuItem key={niv} value={niv}>{niv}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedColumna || !selectedNivel}>
                            <InputLabel>Nivel</InputLabel>
                            <Select
                                value={selectedPosicion}
                                onChange={e => {
                                    setSelectedPosicion(e.target.value);
                                    setCapacidadError('');
                                }}
                                label="Ubicación"
                            >
                                {posiciones.map(pos => (
                                    <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Cantidad"
                            type="number"
                            value={cantidadAMover}
                            onChange={e => setCantidadAMover(Number(e.target.value))}
                            inputProps={{ min: 1, max: selectedZonaUnidad?.unidad.cantidad ?? 1 }}
                            fullWidth
                            margin="normal"
                            sx={{ mt: 2 }}
                            disabled={!selectedColumna || !selectedPosicion || !selectedNivel}
                        />
                        {capacidadError && (
                            <Alert severity="error" sx={{ mt: 2 }}>{capacidadError}</Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setShowMoveFromLoadingZoneModal(false);
                            setSelectedColumna('');
                            setSelectedPosicion('');
                            setSelectedNivel('');
                            setCantidadAMover(1);
                            setSelectedZonaUnidad(null);
                            setCapacidadError('');
                        }}>Cancelar</Button>
                        <Button
                            onClick={handleMoveFromLoadingZone}
                            variant="contained"
                            color="primary"
                            disabled={!selectedColumna || !selectedPosicion || !selectedNivel || cantidadAMover <= 0}
                        >
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    };

    

    return (
        <div >
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>
                <div className='defoult-container'>
                    <ErrorHandler
                        open={false}
                        message=""
                        severity="error"
                        onClose={handleCloseError}
                    />
                    {renderProcesos()}
                </div>
            </div>
        </div>
    );
};

const ControInventario: React.FC = () => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <ControInventarioContent />
            </NotificationProvider>
        </AuthProvider>
    );
};

export default ControInventario;
