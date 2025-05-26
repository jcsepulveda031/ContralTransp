import pool from '../utils/db';

class DescargarModels {
    static async getTransportes(searchTerm: string) {
        let query = `SELECT t.*, 
                            a_origen.nombre as almacen_origen_nombre, 
                            a_destino.nombre as almacen_destino_nombre,
                            a_origen.direccion AS almacen_origen_direccion,
                            c.nombre as conductor_nombre, c.cedula as conductor_cedula,
                            v.marca as vehiculo_marca, v.placa as vehiculo_placa
                    FROM transportes t  JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
                                        JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
                                        JOIN conductores c ON t.conductor_id = c.id
                                        JOIN vehiculos v ON t.vehiculo_id = v.id
                WHERE t.estado in ( 'ARRIBADO', 'DESCARGADO', 'DESCARGANDO', 'COMPLETO' ) ` ;

        const [rows] = await pool.query(query);
        return rows;
    }
    static async getInfoCarga(id: number) {
        const sql = `SELECT a.id, a.zona_id, d.sku, d.cantidad, d.tipo, d.peso,
                            b.identificador, a.fecha_ingreso, a.estado
                        FROM transp_conte_info a INNER JOIN transportes b ON a.transp_id = b.id
                                                INNER JOIN zona_carga_unidad c ON a.zona_id = c.id
                                                INNER JOIN unidad_logistica d ON c.unidad_id = d.id
                                                WHERE b.id = ? AND
                                                        a.estado not in ( 'ELIMINADO', 'DESCARGADA' ) `;
            
        const [rows] = await pool.query(sql, [id]);
        
        return rows;
    
    }   
    static async descargarCarga(id: number, zona_id: number, user_id: number) {
        const sql = `UPDATE transp_conte_info SET estado = 'DESCARGADA' WHERE id = ? AND zona_id = ?`;

        // Get transport and destination warehouse info
        const getTranspSql = `SELECT a.id, a.almacen_destino_id, b.id as cont_id, b.zona_id, c.unidad_id
                                    FROM transportes a  INNER JOIN transp_conte_info b ON b.transp_id = a.id
                                                        INNER JOIN zona_carga_unidad c ON b.zona_id = c.id
                                                        WHERE b.id = ?`;
                                                        
        const [transpRows]: any = await pool.query(getTranspSql, [id]);
        console.log(transpRows);
        if (!transpRows || transpRows.length === 0) {
            throw new Error('No se encontró información del transporte');
        }

        const transpInfo = transpRows[0];

        // Insert into zona_carga_unidad
        const insertZonaSql = `INSERT INTO zona_carga_unidad 
                                (unidad_id, estado, fecha_ingreso, user_id, almacen_id)
                                VALUES (?, 'PREPARADA', NOW(), ?, ?)`;  

        await pool.query(insertZonaSql, [transpInfo.unidad_id, user_id, transpInfo.almacen_destino_id]); // Using user_id = 1 as default
        const [rows] = await pool.query(sql, [id, zona_id]);        
        return rows;
    }   
    static async getInfoID(id: number) {
        const sql = `SELECT t.*, 
                            a_origen.nombre as almacen_origen_nombre, 
                            a_destino.nombre as almacen_destino_nombre,
                            a_origen.direccion AS almacen_origen_direccion,
                            c.nombre as conductor_nombre, c.cedula as conductor_cedula,
                            v.marca as vehiculo_marca, v.placa as vehiculo_placa
                    FROM transportes t  JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
                                        JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
                                        JOIN conductores c ON t.conductor_id = c.id
                                        JOIN vehiculos v ON t.vehiculo_id = v.id
                    WHERE t.id = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    }
    static async getAll(id: number) {
        const sql = `SELECT a.id, a.zona_id, d.sku, d.cantidad, d.tipo, d.peso,
                            b.identificador, a.fecha_ingreso, a.estado
                        FROM transp_conte_info a INNER JOIN transportes b ON a.transp_id = b.id
                                                INNER JOIN zona_carga_unidad c ON a.zona_id = c.id
                                                INNER JOIN unidad_logistica d ON c.unidad_id = d.id
                                                WHERE b.id = ? `;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    }       
    static async finalizarCarga(id: number) {
        const sql = `UPDATE transportes SET estado = 'COMPLETADO' WHERE id = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    }
}
export default DescargarModels;
