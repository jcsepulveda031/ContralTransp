import pool from '../utils/db';

class AsignarCargaModel {

    static async getAll(filters: any = {}) { 

        let query = `SELECT zcu.id, zcu.unidad_id, ul.tipo, ul.codigo,
                            ul.sku, ul.cantidad, ul.peso,
                            ul.volumen, ul.fecha_creacion AS fechaCreacion,
                            zcu.estado, zcu.user_id, zcu.almacen_id
                        FROM transportes t
                        JOIN zona_carga_unidad zcu ON zcu.almacen_id = t.almacen_origen_id
                        JOIN unidad_logistica ul ON ul.id = zcu.unidad_id
                        WHERE zcu.estado = 'PREPARADA'`;

        const params = [];

        if (filters.transporte_id) {
        query += ` AND t.id = ?`;  
        params.push(filters.transporte_id);   
        }

        const [rows] = await pool.query(query, params);
        return rows;
    }
    static async getById(id: number) {
        
        let query = `SELECT zcu.id, zcu.unidad_id, ul.tipo, ul.codigo,
                            ul.sku, ul.cantidad, ul.peso,
                            ul.volumen, ul.fecha_creacion AS fechaCreacion,
                            zcu.estado, zcu.user_id, zcu.almacen_id
                    FROM zona_carga_unidad zcu ON zcu.almacen_id = t.almacen_origen_id
                                            JOIN unidad_logistica ul ON ul.id = zcu.unidad_id
                    WHERE zcu.id = ? and
                        zcu.estado = 'PREPARADA' `;
        
        const [rows] = await pool.query(query, [id]);
        return rows;

    }
    static async update(id:number) {

        let query = `UPDATE zona_carga_unidad SET estado = 'CARGADA' WHERE id = ?`
        const [result] = await pool.query(query, [id]);
        return result;

    }
    static async postCartgaInfo( data: any ) {
        const { zona_id, transp_id, estado, user_id } = data;

        const sql = `INSERT INTO transp_conte_info (zona_id, transp_id, estado, user_id)
                    VALUES (?, ?, ?, ?)`;

    const [result] = await pool.query(sql, [zona_id, transp_id, estado, user_id]);
    return result;
    }
    static async postCargaTransp(id:number) {
        const sql = `UPDATE transportes SET estado = 'CARGANDO' WHERE id = ?`
        const [rows] = await pool.query(sql, [id]);
        
        return rows;
    }
    static async getDetalleCargaM (id:number) { 
        const sql = `SELECT a.id, a.zona_id, d.sku, d.cantidad, d.tipo, d.peso,
                            b.identificador, a.fecha_ingreso, a.estado
                      FROM transp_conte_info a INNER JOIN transportes b ON a.transp_id = b.id
                                               INNER JOIN zona_carga_unidad c ON a.zona_id = c.id
                                               INNER JOIN unidad_logistica d ON c.unidad_id = d.id
                                               WHERE b.id = ? AND
                                                     a.estado <> 'ELIMINADO' `;
        
        const [rows] = await pool.query(sql, [id]);
        
        return rows;
    }
    static async delete (id:number){
        console.log(id)
        const sql = `UPDATE transp_conte_info SET estado = 'ELIMINADO' WHERE id = ?`
        const [rows] = await pool.query(sql, [id]);
        
        return rows;
    }
    static async deleteZona (id:number){
        console.log(id)
        const sql = `UPDATE zona_carga_unidad SET estado = 'PREPARADA' WHERE id = ?`
        const [rows] = await pool.query(sql, [id]);
        
        return rows;
    }
}

export default AsignarCargaModel;