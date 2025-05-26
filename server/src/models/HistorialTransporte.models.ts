import pool from '../utils/db';

class HistorialTransporteModels {
    static async getHistorial() {
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
                        JOIN vehiculos v ON t.vehiculo_id = v.id` ;
    
    
    const [rows] = await pool.query(query);
    return rows;
    }
}

export default HistorialTransporteModels;
