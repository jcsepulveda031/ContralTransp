

export interface User {
    id: number;
    nombre_usuario: string;
    rol: string;
  }

export interface UserTableInfo{
  id: number;
  username:string;
  email:string;
  name: string;
  age: number;
  phone: number;
  role:string;
}
export interface EditUserTableInfoProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (UserData: UserTableInfo) => Promise<boolean>
  User: UserTableInfo;
}
export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, user: User, expiresIn: number) => void;
    logout: () => void;
    checkTokenExpiration: () => boolean;
  }
export interface AuthUser {
    username: string;
    password: string
}

export interface AuthRegister {
    name: string;
    email: string;
    username: string;
    password: string;
    age: string;
    role:string,
    phone: string
}
export interface Almacen {
  id: number;
  codigo: string;
  nombre: string;
  departamento: string;
  ciudad: string;
  direccion: string;
}

export interface Conductor {
  id?: number;
  cedula: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  licencia: string;
  activo?: boolean;
  username: string;
  user_id?: number;
  // Puedes agregar más campos si son necesarios
}
export interface Vehiculo {
  id?: number;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  placa: string;
}

export type Proceso = {
  icon: string;
  title: string;
  description: string;
  path?: string; // Hacemos path opcional con el signo ?
};

export interface Transporte {
  id: number;
  identificador: string;
  almacen_origen_id: number;
  almacen_destino_id: number;
  conductor_id: number;
  vehiculo_id: number;
  fecha_creacion: string;
  hora_creacion: string;
  estado: string;
  almacen_origen_nombre: string;
  almacen_destino_nombre: string;
  conductor_nombre: string;
  conductor_cedula: string;
  vehiculo_marca: string;
  vehiculo_placa: string;
}

export interface ZonaCarga {
  id: number;
  unidad_id: bigint;
  tipo: 'CAJA'| 'PALLET'| 'UA';
  codigo: string;
  sku: string;
  cantidad: number;
  peso: Float32Array;
  volumen: Float32Array;
  fechaCreacion: string;
  estado: 'PREPARADA' | 'CARGADA' | 'CARGANDO';
  user_id : number;
  almacen_id : number;
}
export interface InfoCarga {
  id:number,
  zona_id:number,
  sku: string,
  cantidad: number, 
  tipo: number,
  peso: number,
  transp_id: number,
  codigo: string,
  identificador : string,
  estado: number,
  fecha_ingreso: string,

}

export interface Almacen {
  id: number;
  codigo: string;
  nombre: string;
  ciudad: string;
  direccion: string;
}

export interface EditAlmacenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (almacenData: Almacen) => Promise<boolean>;
  almacen: Almacen;
}

export interface TransportAssignment {
    id: string;
    originWarehouse: string;
    destinationWarehouse: string;
    vehicle: string;
    estimatedTime?: string;
    status: string;
    detail?: string;
    detailsHistory?: { date: string; time: string; content: string }[];
  }
  
  export interface historialDriverTras {

    id: number;
    transporte_id: number;
    conductor_id: number;
    estado: string;
    tiempo_recorrido_horas: string;
    tiempo_recomendado_horas: string;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    observaciones: string;
    identificador: string;
    almacen_origen_nombre: string;
    almacen_destino_nombre: string;
    almacen_origen_direccion: string;
    almacen_destino_direccion: string;
    vehiculo_marca: string;
    vehiculo_placa: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    quantity: number;
    sku: string;
}

export interface PickingLocation {
    id: string;
    column: string;
    position: string;
    level: string;
    type: 'picking' | 'alternate';
    currentStock: number;
    capacity: number;
    products: Product[];
} 
export interface Ubicacion {
  id:number,
  almacen_id:number,
  columna:string,
  nivel:string,
  posicion:string,
  tipo:string,
  stock_actual:number,
  capacidad:number,
  unidades?: any[];
}

export interface UnidadLogistica {
  id: number;
  tipo: 'CAJA' | 'PALLET' | 'UA';
  codigo: string;
  sku: string | null;
  cantidad: number | null;
  peso: number | null;
  volumen: number | null;
  dimensiones: string | null;
  fecha_creacion: string;
}
export interface UbicacionUnidad {
  id: number;
  ubicacion_id: number;
  unidad_id: number;
  cantidad: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}
export interface UbicacionPicking {
  id: number;
  almacen_id: number;
  columna: string;
  posicion: string;
  nivel: string;
  tipo: 'picking' | 'alternate';
  capacidad: number;
  stock_actual: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  fecha_creacion: string;
  fecha_actualizacion: string;
}
export interface LocationWithDetails extends UbicacionPicking {
  unidades: (UbicacionUnidad & { unidad: UnidadLogistica })[];
}


export interface MovimientoStock {
  id: number;
  ubicacion_origen_id: number;
  ubicacion_destino_id: number;
  unidad_id: number;
  cantidad: number;
  tipo_movimiento: 'transferencia' | 'recepcion' | 'despacho';
  estado: 'pendiente' | 'completado' | 'cancelado';
  usuario_id: number;
  fecha_completado: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface AlertaStock {
  id: number;
  ubicacion_id: number;
  unidad_id: number;
  tipo_alerta: 'stock_bajo' | 'sobrestock' | 'vencimiento';
  umbral: number;
  valor_actual: number;
  estado: 'activo' | 'resuelto';
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ZonaCargaUnidad {
  id: number;
  unidad_id: number;
  estado: 'PREPARADA' | 'CARGANDO' | 'CARGADA' | 'ELIMINADO';
  fecha_ingreso: string;
  user_id: number | null;
  almacen_id: number | null;
}

// Types for the UI state
export interface FilterState {
  columna: string | null;
  nivel: string | null;
  estado: 'empty' | 'partial' | 'full' | null;
}



export interface LoadingZoneState {
  id: string;
  name: string;
  stock_actual: number;
  capacidad: number;
  unidades: (ZonaCargaUnidad & { unidad: UnidadLogistica })[];
} 


export interface User {
  id: number;
  nombre_usuario: string;
  email: string;
  password: string;
  rol: string;
  estado: boolean;
} 