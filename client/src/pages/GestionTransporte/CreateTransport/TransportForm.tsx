import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../pages/navbar/Navbar';
//import SearchModal from '../../Modal/SearchModal';
import api from '../../../services/api';
import './styles/TransportForm.css';
import { AuthProvider } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import Alert from '../alert';
import ModalBusqueda from './Modal/ModalBusqueda';
import { getTransConductoresSearch, getTransVehiculoSearch,getTransAlmacenSearch, getTransIdTransp,
        getAlmacenesModalSearch,getConductoresModalSearch,getVehiculosModalSearch,showFinalTrans } from './services/TransporteForm.service';
import { FaArrowLeft, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaSpinner, FaEdit, FaEye, FaPlus } from 'react-icons/fa';

type FormMode = 'create' | 'view' | 'edit';

interface TransportFormProps {
    mode?: FormMode;
    onSubmit?: (data: any) => void;
}

interface NotificationState {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    show: boolean;
    details?: string;
}

type NotificationType = 'success' | 'error' | 'warning' | 'info';

const TransportForm: React.FC<TransportFormProps> = ({ mode = 'create', onSubmit }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [currentMode, setCurrentMode] = useState<FormMode>(mode);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { showNotification } = useNotification();

    // Estados para manejar la carga de cada búsqueda
    const [isSearchingConductor, setIsSearchingConductor] = useState(false);
    const [isSearchingVehiculo, setIsSearchingVehiculo] = useState(false);
    const [isSearchingAlmacenOrigen, setIsSearchingAlmacenOrigen] = useState(false);
    const [isSearchingAlmacenDestino, setIsSearchingAlmacenDestino] = useState(false);
    const [searchType, setSearchType] = useState<'conductor' | 'vehiculo' | 'almacen_origen' | 'almacen_destino' | null>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [formData, setFormData] = useState({
        identificador: '',
        almacen_origen_id: '',
        almacen_origen_codigo: '',
        almacen_origen_direccion: '',
        almacen_destino_id: '',
        almacen_destino_codigo: '',
        almacen_destino_direccion: '',
        conductor_id: '',
        vehiculo_id: '',
        almacen_origen_nombre: '',
        almacen_destino_nombre: '',
        conductor_nombre: '',
        conductor_cedula: '',
        conductor_licencia: '',
        vehiculo_marca: '',
        vehiculo_placa: '',
        vehiculo_modelo: '',
        Vehiculo_añó: ''
    });

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    // Prevenir el submit del formulario al presionar Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // Función para buscar conductor por cédula
    const searchConductorByCedula = useCallback(async (cedula: string) => {
        if (!cedula || cedula.length < 3) return;
        
        try {
            setIsSearchingConductor(true);
            const response = await getTransConductoresSearch(cedula);
            if (response.length > 0) {
                const conductor = response[0];
                setFormData(prev => ({
                    ...prev,
                    conductor_id: conductor.id,
                    conductor_nombre: conductor.nombre,
                    conductor_cedula: conductor.cedula,
                    conductor_licencia: conductor.licencia
                }));
                setErrors(prev => ({ ...prev, conductor: '' }));
                // Activar automáticamente la búsqueda del vehículo
                setTimeout(() => {
                    const vehiculoInput = document.querySelector('input[name="vehiculo_placa"]') as HTMLInputElement;
                    if (vehiculoInput) {
                        vehiculoInput.focus();
                    }
                }, 100);
            } else {
                //setErrors(prev => ({ ...prev, conductor: 'No se encontró un conductor con esta cédula' }));
                showNotification('warning', 'No se encontró un conductor con esta cédula');
                setFormData(prev => ({
                    ...prev,
                    conductor_id: '',
                    conductor_nombre: '',
                    conductor_cedula: cedula
                }));
            }
        } catch (error) {
            //console.error('Error al buscar conductor:', error);
            //setErrors(prev => ({ ...prev, conductor: 'Error al buscar conductor' }));
            showNotification('error', 'Error al buscar conductor');
        } finally {
            setIsSearchingConductor(false);
        }
    }, []);

    // Función para buscar vehículo por placa
    const searchVehiculoByPlaca = useCallback(async (placa: string) => {
        if (!placa || placa.length < 3) return;
        
        try {
            setIsSearchingVehiculo(true);
            const response = await getTransVehiculoSearch(placa);
            if (response.length > 0) {
                const vehiculo = response[0];
                setFormData(prev => ({
                    ...prev,
                    vehiculo_id: vehiculo.id,
                    vehiculo_placa: vehiculo.placa,
                    vehiculo_marca: vehiculo.marca,
                    vehiculo_modelo: vehiculo.modelo,
                    Vehiculo_añó: vehiculo.año
                }));
                setErrors(prev => ({ ...prev, vehiculo: '' }));
                //showNotification('success', 'Vehículo encontrado');
                // Activar automáticamente la búsqueda del almacén origen
                setTimeout(() => {
                    const almacenOrigenInput = document.querySelector('input[name="almacen_origen_codigo"]') as HTMLInputElement;
                    if (almacenOrigenInput) {
                        almacenOrigenInput.focus();
                    }
                }, 100);
            } else {
                setErrors(prev => ({ ...prev, vehiculo: 'No se encontró un vehículo con esta placa' }));
                setFormData(prev => ({
                    ...prev,
                    vehiculo_id: '',
                    vehiculo_placa: placa
                }));
                showNotification('warning', 'No se encontró el vehículo');
            }
        } catch (error) {
            console.error('Error al buscar vehículo:', error);
            setErrors(prev => ({ ...prev, vehiculo: 'Error al buscar vehículo' }));
            showNotification('error', 'Error al buscar vehículo');
        } finally {
            setIsSearchingVehiculo(false);
        }
    }, []);

    // Función para buscar almacén por código (origen, ahora solo con Enter)
    const searchAlmacenOrigenByCodigo = useCallback(async (codigo: string) => {
        if (!codigo || codigo.length < 3) return;
        
        try {
            setIsSearchingAlmacenOrigen(true);
            const response = await getTransAlmacenSearch(codigo) //api.get(`/almacenes_t/cod/${codigo}`);
            if (response.length > 0) {
                const almacen = response[0];
                setFormData(prev => ({
                    ...prev,
                    almacen_origen_id: almacen.id,
                    almacen_origen_nombre: almacen.nombre,
                    almacen_origen_codigo: almacen.codigo,
                    almacen_origen_direccion: almacen.direccion
                }));
                setErrors(prev => ({ ...prev, almacen_origen: '' }));
            } else {
                //setErrors(prev => ({ ...prev, almacen_origen: 'No se encontró un almacén con este código' }));
                showNotification('warning', 'No se encontró un almacén con este código');
                setFormData(prev => ({
                    ...prev,
                    almacen_origen_id: '',
                    almacen_origen_nombre: ''
                }));
            }
        } catch (error) {
            setErrors(prev => ({ ...prev, almacen_origen: 'Error al buscar almacén' }));
            showNotification('error', 'No se encontró un almacén con este código');
        } finally {
            setIsSearchingAlmacenOrigen(false);
        }
    }, []);

    // Función para buscar almacén por código (destino, ahora solo con Enter)
    const searchAlmacenDestinoByCodigo = useCallback(async (codigo: string) => {
        if (!codigo || codigo.length < 3) return;
        
        try {
            setIsSearchingAlmacenDestino(true);
            const response = await getTransAlmacenSearch(codigo) //api.get(`/almacenes_t/cod/${codigo}`);
            if (response.length > 0) {
                const almacen = response[0];
                setFormData(prev => ({
                    ...prev,
                    almacen_destino_id: almacen.id,
                    almacen_destino_nombre: almacen.nombre,
                    almacen_destino_codigo: almacen.codigo,
                    almacen_destino_direccion: almacen.direccion
                }));
                setErrors(prev => ({ ...prev, almacen_destino: '' }));
            } else {
                //setErrors(prev => ({ ...prev, almacen_destino: 'No se encontró un almacén con este código' }));
                showNotification('warning', 'No se encontró un almacén con este código');
                setFormData(prev => ({
                    ...prev,
                    almacen_destino_id: '',
                    almacen_destino_nombre: ''
                }));
            }
        } catch (error) {
            //console.error('Error al buscar almacén destino:', error);
            //setErrors(prev => ({ ...prev, almacen_destino: 'Error al buscar almacén' }));
            showNotification('error', 'Error al buscar almacén');
        } finally {
            setIsSearchingAlmacenDestino(false);
        }
    }, []);

    // Manejadores de tecla Enter para cada campo
    const handleKeyDownConductor = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchConductorByCedula(formData.conductor_cedula);
        }
    };

    const handleKeyDownVehiculo = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchVehiculoByPlaca(formData.vehiculo_placa);
        }
    };

    const handleKeyDownAlmacenOrigen = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchAlmacenOrigenByCodigo(formData.almacen_origen_codigo);
        }
    };

    const handleKeyDownAlmacenDestino = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchAlmacenDestinoByCodigo(formData.almacen_destino_codigo);
        }
    };

    const validateForm = () => {
        console.log('Prueba');
        const newErrors: Record<string, string> = {};
        
        if (!formData.identificador) newErrors.identificador = 'Identificador es requerido';
        if (!formData.almacen_origen_id) newErrors.almacen_origen = 'Almacén origen es requerido';
        if (!formData.almacen_destino_id) newErrors.almacen_destino = 'Almacén destino es requerido';
        if (!formData.conductor_id) newErrors.conductor = 'Conductor es requerido';
        if (!formData.vehiculo_id) newErrors.vehiculo = 'Vehículo es requerido';
        
        if (formData.almacen_origen_id && formData.almacen_destino_id && 
            formData.almacen_origen_id === formData.almacen_destino_id) {
            newErrors.almacen_destino = 'El almacén destino debe ser diferente al origen';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleBuscar = async (tipo: 'conductor' | 'vehiculo' | 'almacen_origen' | 'almacen_destino') => {
        setSearchType(tipo);
        setShowModal(true);
        setIsModalLoading(true); // Activar carga
        
        try {
            let results: any[] = [];
            
            if (tipo === 'conductor') {
                results = await getConductoresModalSearch();
            } else if (tipo === 'vehiculo') {
                results = await getVehiculosModalSearch();
            } else if (tipo === 'almacen_origen' || tipo === 'almacen_destino') {
                results = await getAlmacenesModalSearch();
            }
            
            setSearchResults(results);
        } catch (error) {
            console.error('Error buscando datos:', error);
            setSearchResults([]); // Asegurar array vacío en caso de error
        } finally {
            setIsModalLoading(false); // Desactivar carga
        }
    };
    const handleSeleccionar = (item: any) => {
        setShowModal(false);
        switch (searchType) {
            case 'conductor':
                setFormData(prev => ({
                    ...prev,
                    conductor_id: item.id,
                    conductor_nombre: item.nombre,
                    conductor_cedula: item.cedula,
                    conductor_licencia: item.licencia
                }));
                // Activar automáticamente la búsqueda del vehículo
                setTimeout(() => {
                    const vehiculoInput = document.querySelector('input[name="vehiculo_placa"]') as HTMLInputElement;
                    if (vehiculoInput) {
                        vehiculoInput.focus();
                    }
                }, 100);
                break;
            case 'vehiculo':
                setFormData(prev => ({
                    ...prev,
                    vehiculo_id: item.id,
                    vehiculo_placa: item.placa,
                    vehiculo_marca: item.marca,
                    vehiculo_modelo: item.modelo,
                    Vehiculo_añó: item.año
                }));
                // Activar automáticamente la búsqueda del almacén origen
                setTimeout(() => {
                    const almacenOrigenInput = document.querySelector('input[name="almacen_origen_codigo"]') as HTMLInputElement;
                    if (almacenOrigenInput) {
                        almacenOrigenInput.focus();
                    }
                }, 100);
                break;
            case 'almacen_origen':
                setFormData(prev => ({
                    ...prev,
                    almacen_origen_id: item.id,
                    almacen_origen_codigo: item.codigo,
                    almacen_origen_nombre: item.nombre,
                    almacen_origen_direccion: item.direccion
                }));
                // Activar automáticamente la búsqueda del almacén destino
                setTimeout(() => {
                    const almacenDestinoInput = document.querySelector('input[name="almacen_destino_codigo"]') as HTMLInputElement;
                    if (almacenDestinoInput) {
                        almacenDestinoInput.focus();
                    }
                }, 100);
                break;
            case 'almacen_destino':
                setFormData(prev => ({
                    ...prev,
                    almacen_destino_id: item.id,
                    almacen_destino_codigo: item.codigo,
                    almacen_destino_nombre: item.nombre,
                    almacen_destino_direccion: item.direccion
                }));
                break;
            default:
                break;
        }
    };
    // Función handleSubmit implementada
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Prueba');
        if (!validateForm()) {
            return;
        }
        
        try {
            setIsSubmitting(true);

            const transporteData = {
                identificador: formData.identificador,
                almacen_origen_id: formData.almacen_origen_id,
                almacen_destino_id: formData.almacen_destino_id,
                conductor_id: formData.conductor_id,
                vehiculo_id: formData.vehiculo_id,
                estado: 'NUEVO',
                fecha_creacion: new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
            };

            let response;

            if (id) {
                response = await api.put(`/CreateTransportes/${id}`, transporteData);
                showNotification('success', 'Transporte actualizado correctamente');
                navigate('/Contaltransp/Transporte/CreateTransp');
            } else {
                const TanspExist = await getTransIdTransp(transporteData.identificador);
                if (TanspExist.length === 0) {
                    response = await api.post('/CreateTransportes', transporteData);
                    showNotification('success', 'Transporte creado correctamente');
                    navigate('/Contaltransp/Transporte/CreateTransp');
                } else {
                    setErrors(prev => ({ ...prev, identificador: 'El identificador del transporte ya existe' }));
                    showNotification('error', 'El identificador del transporte ya existe');
                }
            }
        } catch (error) {
            showNotification('error', 'Error al procesar la solicitud');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect( () => {
        
        const fetchData = async () => {
            if (id) {
                try {
                    const response = await api.get(`/CreateTransportes/${id}`);
                    const transporte = response.data[0];
                    if (transporte) {
                        setFormData(prev => ({ ...prev, ...transporte }));
                    }
                } catch (error) {
                    console.error('Error al obtener datos del transporte:', error);
                }
            } else {
                try {
                    const nextId = await showFinalTrans();
                    
                    console.log('Próximo ID obtenido:', nextId.id[0].proximo_identificador);
                    
                    // Usa el nextId como necesites
                    setFormData(prev => ({
                        ...prev,
                        identificador: nextId.id[0].proximo_identificador
                    }));
                } catch (error) {
                    console.error('Error obteniendo próximo ID:', error);
                    // Usa un valor por defecto
                    setFormData(prev => ({
                        ...prev,
                        identificador: 'TRANS-001'
                    }));
                }
            }
        };
        fetchData();
    }, [id]);

    // Utilidad para saber si el formulario está en modo solo lectura
    const isReadOnly = currentMode === 'view';

    return (
        <AuthProvider>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet"/>

            <div >
                
                
                <Navbar isOpen={isOpen} onClose={toggleNavbar} />
                
                <div className={`content ${isOpen ? 'shift' : ''}`}>
                    <div className='defoult-container'>
                        <div className="procesos-page ">
                            <div className="transport-form-new-container">
                            
                                <h1 className="form-title-new">{id ? 'Editar Transporte' : 'Crear Transporte'}</h1>
                                <form onSubmit={handleSubmit} className="transport-form-new" onKeyDown={handleKeyDown}>
                                    <div className="form-grid-new">
                                        <fieldset className="fieldset-new">
                                            <legend>Información General</legend>
                                            <div className="form-group-new">
                                                <div className="read-only-field">
                                                    {formData.identificador}
                                                    <input 
                                                        type="hidden"
                                                        name="identificador"  
                                                        value={formData.identificador}  
                                                        onChange={(e) => setFormData(prev => ({ ...prev, identificador: e.target.value }))}
                                                        required 
                                                        readOnly={!!id}
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className="fieldset-new">
                                            <legend>Almacén Origen</legend>
                                            <div className="form-group-new">
                                                <label>Código:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.almacen_origen_codigo}   
                                                    onChange={(e) => setFormData(prev => ({ ...prev, almacen_origen_codigo: e.target.value }))}
                                                    onKeyDown={handleKeyDownAlmacenOrigen}
                                                    placeholder="Ingrese código y presione Enter para buscar"
                                                    disabled={isReadOnly || isSearchingAlmacenOrigen}
                                                />
                                                {isSearchingAlmacenOrigen && <span>Buscando almacén...</span>}
                                            </div>
                                            <div className="form-group-new ">
                                                <label>Nombre:</label>
                                                <input 
                                                    type="text" 
                                                    className='read-only-field'
                                                    value={formData.almacen_origen_nombre}   
                                                    onChange={(e) => setFormData(prev => ({ ...prev, almacen_origen_nombre: e.target.value }))}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group-new">
                                                <label >Dirección:</label>
                                                <input type="text" value={formData.almacen_origen_direccion} 
                                                        className='read-only-field'
                                                        onChange={(e) => setFormData(prev => ({ ...prev, almacen_origen_direccion: e.target.value }))}
                                                        readOnly />
                                            </div>
                                            {!isReadOnly && (
                                            <div className="form-group-new">
                                                <button type="button" className="search-button-new pro-btn" onClick={() => handleBuscar('almacen_origen')}>
                                                    Buscar
                                                </button>
                                            </div>
                                            )}
                                        </fieldset>
                                        <fieldset className="fieldset-new">
                                            <legend>Almacén Destino</legend>
                                            <div className="form-group-new">
                                                <label>Código:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.almacen_destino_codigo}   
                                                    onChange={(e) => setFormData(prev => ({ ...prev, almacen_destino_codigo: e.target.value }))}
                                                    onKeyDown={handleKeyDownAlmacenDestino}
                                                    placeholder="Ingrese código y presione Enter para buscar"
                                                    disabled={isReadOnly || isSearchingAlmacenDestino}
                                                />
                                                {isSearchingAlmacenDestino && <span>Buscando almacén...</span>}
                                            </div>
                                            <div className="form-group-new">
                                                <label>Nombre:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.almacen_destino_nombre}  
                                                    className='read-only-field'
                                                    onChange={(e) => setFormData(prev => ({ ...prev, almacen_destino_nombre: e.target.value }))}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group-new">
                                                <label>Dirección:</label>
                                                <input  type="text" value={formData.almacen_destino_direccion}  
                                                        className='read-only-field'
                                                        onChange={(e) => setFormData(prev => ({ ...prev, almacen_destino_direccion: e.target.value }))}
                                                        readOnly/>
                                            </div>
                                            {!isReadOnly && (
                                            <div className="form-group-new">
                                                <button type="button" className="search-button-new pro-btn" onClick={() => handleBuscar('almacen_destino')}>
                                                    Buscar
                                                </button>
                                            </div>
                                            )}
                                        </fieldset>
                                        <fieldset className="fieldset-new">
                                            <legend>Conductor</legend>
                                            <div className="form-group-new">
                                                <label>Cédula:</label>
                                                <input 
                                                    type="text" 
                                                    name="conductor_cedula"
                                                    value={formData.conductor_cedula} 
                                                    onChange={(e) => setFormData(prev => ({ ...prev, conductor_cedula: e.target.value }))} 
                                                    onKeyDown={handleKeyDownConductor}
                                                    placeholder="Ingrese cédula y presione Enter para buscar"
                                                    disabled={isReadOnly || isSearchingConductor}
                                                />
                                                {isSearchingConductor && <span>Buscando conductor...</span>}
                                            </div>
                                            <div className="form-group-new">
                                                <label>Nombre:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.conductor_nombre}
                                                    className='read-only-field' 
                                                    onChange={(e) => setFormData(prev => ({ ...prev, conductor_nombre: e.target.value }))} 
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group-new">
                                                <label>Licencia:</label>
                                                <input  type="text" value={formData.conductor_licencia}
                                                        className='read-only-field' 
                                                        onChange={(e) => setFormData(prev => ({ ...prev, conductor_licencia: e.target.value }))} 
                                                        readOnly />
                                            </div>
                                            {!isReadOnly && (
                                            <div className="form-group-new">
                                                <button type="button" className="search-button-new pro-btn" onClick={() => handleBuscar('conductor')}>
                                                    Buscar
                                                </button>
                                            </div>
                                            )}
                                        </fieldset>
                                        <fieldset className="fieldset-new">
                                            <legend>Vehículo</legend>
                                            <div className="form-group-new">
                                                <label>Placa:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.vehiculo_placa}  
                                                    onChange={(e) => setFormData(prev => ({ ...prev, vehiculo_placa: e.target.value }))}
                                                    onKeyDown={handleKeyDownVehiculo}
                                                    placeholder="Ingrese placa y presione Enter para buscar"
                                                    disabled={isReadOnly || isSearchingVehiculo}
                                                />
                                                {isSearchingVehiculo && <span>Buscando vehículo...</span>}
                                            </div>
                                            <div className="form-group-new">
                                                <label>Marca:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.vehiculo_marca} 
                                                    className='read-only-field'
                                                    onChange={(e) => setFormData(prev => ({ ...prev, vehiculo_marca: e.target.value }))} 
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group-new">
                                                <label>Modelo:</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.vehiculo_modelo} 
                                                    className='read-only-field'
                                                    onChange={(e) => setFormData(prev => ({ ...prev, vehiculo_modelo: e.target.value }))} 
                                                    readOnly />
                                            </div>
                                            {!isReadOnly && (
                                            <div className="form-group-new">
                                                <button type="button" className="search-button-new pro-btn" onClick={() => handleBuscar('vehiculo')}>
                                                    Buscar
                                                </button>
                                            </div>
                                            )}
                                        </fieldset>
                                    </div>
                                    {!isReadOnly && (
                                        <div className="form-actions-new" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap', marginBottom: '1.2rem' }}>
                                            <button type="button" className="btn-cancel-new pro-btn" onClick={() => navigate('/Contaltransp/Transporte/CreateTransp')}>
                                                <span className="btn-icon" style={{ fontSize: 24 }}>✖️</span> Cancelar
                                            </button>
                                            <button type="submit" className="btn-submit-new pro-btn" disabled={isSubmitting}>
                                                <span className="btn-icon" style={{ fontSize: 24 }}>💾</span> {isSubmitting ? 'Procesando...' : (id ? 'Actualizar' : 'Crear')}
                                            </button>
                                        </div>
                                    )}
                                </form>
                                {showModal && (
                                    <ModalBusqueda
                                    tipo={searchType}
                                    datos={searchResults}
                                    onClose={() => setShowModal(false)}
                                    onSelect={handleSeleccionar}
                                    isLoading={isModalLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
};

export default TransportForm;