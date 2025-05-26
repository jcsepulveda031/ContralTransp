export interface Warehouse {
  id: number;
  name: string;
  capacity: number;
  currentStock: number;
}

export interface Location {
  id: string;
  name: string;
  type: 'picking' | 'storage' | 'loading';
  level: number;
  capacity: number;
  currentStock: number;
  status: 'available' | 'occupied' | 'warning';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  location: string;
  minStock: number;
  maxStock: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  date: Date;
  type: 'transfer' | 'receipt' | 'dispatch';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'resolved';
}

export interface StockMetrics {
  totalStock: number;
  availableLocations: number;
  occupiedLocations: number;
  pendingMovements: number;
  lowStockItems: number;
}

export interface FilterOptions {
  warehouse?: number;
  location?: string;
  product?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string;
} 