export interface UnidadLogistica {
  id: number;
  sku: string;
  descripcion: string;
  cantidad: number;
  ubicacion: string;
}

export interface Ubicacion {
  id: number;
  nombre: string;
  unidades: UnidadLogistica[];
}

export interface ZonaCarga {
  id: number;
  stock_actual: number;
  capacidad_maxima: number;
}

export interface Movimiento {
  id: number;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: string;
  sku: string;
  ubicacion: string;
} 