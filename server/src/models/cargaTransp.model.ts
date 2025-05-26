import pool from '../utils/db';
import {  RowDataPacket } from 'mysql2/promise';

interface Transporte extends RowDataPacket{
  id: number;
  identificador: string;
  almacen_origen_id: number;
  almacen_destino_id: number;
  conductor_id: number;
  vehiculo_id: number;
  fecha_creacion: string;
  hora_creacion: string;
  estado: 'NUEVO' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
}
interface Conductor extends RowDataPacket {
  id: number;
  status: 'activo' | 'ocupado';
  // otros campos...
}

interface Vehiculo extends RowDataPacket {
  id: number;
  status: 'activo' | 'ocupado';
  // otros campos...
}

export interface UpdateResult {
    affectedRows: number;
    changedRows: number;
    fieldCount: number;
    // ... otros campos relevantes
  }


  class CargaTransportes {
    static async getAll(filters: any = {}) {
        let query = `SELECT t.*, 
                    a_origen.nombre as almacen_origen_nombre, 
                    a_destino.nombre as almacen_destino_nombre,
                    a_origen.direccion AS almacen_origen_direccion,
                    c.nombre as conductor_nombre, c.cedula as conductor_cedula,
                    v.marca as vehiculo_marca, v.placa as vehiculo_placa
                    FROM transportes t
                    JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
                    JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
                    JOIN conductores c ON t.conductor_id = c.id
                    JOIN vehiculos v ON t.vehiculo_id = v.id
                    WHERE t.estado = 'NUEVO' OR t.estado = 'CARGANDO'`;
        
        const params = [];
        
        if (filters.search) {
          query += ` AND (
            t.identificador LIKE ?
            OR a_origen.nombre LIKE ?
            OR a_destino.nombre LIKE ?
            OR v.marca LIKE ?
            OR v.placa LIKE ?
            OR c.nombre LIKE ?
          )`;
          const searchValue = `%${filters.search}%`;
          params.push(searchValue, searchValue, searchValue, searchValue, searchValue, searchValue);
        }
        
        const [rows] = await pool.query(query, params);
        return rows;
        
      }
      static async getById(id: string) {
        const query = `
            SELECT t.*, 
                a_origen.nombre AS almacen_origen_nombre,
                a_origen.codigo AS almacen_origen_codigo,
                a_origen.direccion AS almacen_origen_direccion,
                a_destino.nombre AS almacen_destino_nombre,
                a_destino.codigo AS almacen_destino_codigo, 
                a_destino.direccion AS almacen_destino_direccion,
                c.nombre AS conductor_nombre, c.cedula AS conductor_cedula,
                c.licencia as conductor_licencia,
                v.marca AS vehiculo_marca, v.placa AS vehiculo_placa,v.modelo AS vehiculo_modelo,
                v.año as vehiculo_año
            FROM transportes t
            JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
            JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
            JOIN conductores c ON t.conductor_id = c.id
            JOIN vehiculos v ON t.vehiculo_id = v.id
            WHERE t.id = ? AND 
                  t.estado = 'NUEVO' OR t.estado = 'CARGANDO'
        `;
    
        const [rows] = await pool.query(query, [id]);
        return rows;
    }

  }