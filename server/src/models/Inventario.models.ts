import pool from '../utils/db';

class InventarioModels {
    static async getPickingLocations(id: string) {
        const query = `
            SELECT 
                up.id AS up_id,
                up.almacen_id,
                up.columna,
                up.posicion,
                up.nivel,
                up.tipo,
                up.capacidad,
                up.stock_actual,
                up.estado,
                up.fecha_creacion AS up_fecha_creacion,
                up.fecha_actualizacion AS up_fecha_actualizacion,
    
                uu.id AS uu_id,
                uu.cantidad AS uu_cantidad,
                uu.fecha_actualizacion AS uu_fecha_actualizacion,
    
                ul.id AS ul_id,
                ul.tipo AS ul_tipo,
                ul.codigo AS ul_codigo,
                ul.sku AS ul_sku,
                ul.cantidad AS ul_cantidad,
                ul.peso AS ul_peso,
                ul.volumen AS ul_volumen,
                ul.dimensiones AS ul_dimensiones,
                ul.fecha_creacion AS ul_fecha_creacion
    
            FROM ubicaciones_picking up
            LEFT JOIN ubicacion_unidad uu ON uu.ubicacion_id = up.id
            LEFT JOIN unidad_logistica ul ON ul.id = uu.unidad_id
            WHERE up.almacen_id = ?
            ORDER BY up.id;
        `;
        const [rows] = await pool.query(query, [id]);
        return rows;
    }
    static async getZonaCarga(id: number) {
        const query = `
            SELECT 
                zcu.id AS zcu_id,
                zcu.unidad_id,
                zcu.estado,
                zcu.fecha_ingreso,
                zcu.user_id,
                zcu.almacen_id,
    
                ul.id AS ul_id,
                ul.tipo,
                ul.codigo,
                ul.sku,
                zcu.cantidad,
                ul.peso,
                ul.volumen,
                ul.dimensiones,
                ul.fecha_creacion
    
            FROM zona_carga_unidad zcu
            LEFT JOIN unidad_logistica ul ON zcu.unidad_id = ul.id
            WHERE zcu.almacen_id = ? and 
				  zcu.estado = 'PREPARADA' and
                  zcu.cantidad > 0
            ORDER BY zcu.fecha_ingreso DESC;
        `;
        const [rows] = await pool.query(query, [id]);
        return rows;
    }
    static async moveToLoadingZone(unidadId: number, cantidad: number) {
        const query = `
            UPDATE unidad_logistica 
            SET cantidad = cantidad - ? 
            WHERE id = ?;
        `;
        const [rows] = await pool.query(query, [cantidad, unidadId]);
        return rows;
    }
    static async moveToPickingLocation(unidadId: number, cantidad: number, ubicacionId: number) {


        let sql =  ` SELECT * FROM ubicacion_unidad WHERE unidad_id = ? AND ubicacion_id = ?`;

        // Verificar si la unidad existe en la ubicación
        const [existe] :any = await pool.query(sql, [unidadId, ubicacionId]);
        console.log(existe);
        if (existe.length === 0) {
            sql = `INSERT INTO ubicacion_unidad (unidad_id, ubicacion_id, cantidad) VALUES (?, ?, ?);`;
            const [rows] = await pool.query(sql, [unidadId, ubicacionId, cantidad]);
            return rows;
        }else{
            sql = `UPDATE ubicacion_unidad SET cantidad = cantidad + ? WHERE unidad_id = ? AND ubicacion_id = ?;`;
            const [rows] = await pool.query(sql, [cantidad, unidadId, ubicacionId]);
            return rows;
        }

    }
    static async updateZonaUnidad(zonaUnidadId: number, cantidad: number) {
        const query = `UPDATE zona_carga_unidad SET cantidad = cantidad - ? WHERE id = ?;`;
        const [rows] = await pool.query(query, [cantidad, zonaUnidadId]);
        return rows;
    }  
    static async updateUbicacionesPicking(ubicacionId: number, cantidad: number) {  
        const query = `UPDATE ubicaciones_picking SET stock_actual = stock_actual + ? WHERE id = ?;`;
        const [rows] = await pool.query(query, [cantidad, ubicacionId]);
        return rows;
    }
    static async updateUbicacionesPickingRest(ubicacionId: number, cantidad: number) {  
        const query = `UPDATE ubicaciones_picking SET stock_actual = stock_actual - ? WHERE id = ?;`;
        const [rows] = await pool.query(query, [cantidad, ubicacionId]);
        return rows;
    }
    static async moveToPickingLocationZone(zonaUnidadId: number, cantidad: number, almacen_id: number, user_id: number) {

        let sql = `SELECT * FROM zona_carga_unidad WHERE unidad_id = ? AND cantidad > 0 AND estado = 'PREPARADA';`;
        console.log('Zona Unidad Id',zonaUnidadId);
        const [existe] :any = await pool.query(sql, [zonaUnidadId]);
        if(existe.length === 0){
            sql = `INSERT INTO zona_carga_unidad (unidad_id, cantidad, estado, fecha_ingreso, user_id, almacen_id) VALUES (?, ?, ?, ?, ?, ?);`;
            const [rows] = await pool.query(sql, [zonaUnidadId, cantidad, 'PREPARADA', new Date(), user_id, almacen_id]);
            return rows;
        }else{
            console.log('Existe la unidad en la ubicación',existe);
            sql = `UPDATE zona_carga_unidad SET cantidad = cantidad + ? WHERE id = ?;`;
            const [rows] = await pool.query(sql, [cantidad, existe[0].id]);
            return rows;
        }
    }
    static async createMovimientoStock(unidadId: number, cantidad: number, ubicacionId: number, zonaUnidadId: number | null) {
        const query = `INSERT INTO movimientos_stock (ubicacion_origen_id, ubicacion_destino_id,unidad_id, cantidad, tipo_movimiento,estado, user_id, fecha_creacion, fecha_actualizacion,zona_carga_unidad_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const [rows] = await pool.query(query, [unidadId, cantidad, ubicacionId, zonaUnidadId]);
        return rows;
    }
    static async postUbicationToUbication(unidadId: number, cantidad: number, ubicacionId: number, zonaUnidadId: number | null) {
        const fecha_actualizacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const query = `INSERT INTO ubicacion_unidad (ubicacion_id , unidad_id, cantidad,fecha_actualizacion  ) VALUES (?, ?, ?, ?);`;
        const [rows] = await pool.query(query, [ubicacionId, unidadId, cantidad,  fecha_actualizacion]);
        return rows;
    }
    static async updateUbicacionesRest(ubicacionId: number, cantidad: number) {
        const query = `UPDATE ubicacion_unidad SET cantidad = cantidad - ? WHERE id = ?;`;
        const [rows] = await pool.query(query, [cantidad, ubicacionId]);
        return rows;
    }
}

export default InventarioModels;