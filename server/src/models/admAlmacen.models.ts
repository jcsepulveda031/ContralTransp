import pool from '../utils/db'; 

interface Almacen {
    id?: number;
    codigo: string;
    nombre: string;
    ciudad: string;
    direccion: string;
}

  interface Ubicacion {
    id?: number;
    almacen_id: number;
    columna: string;
    posicion: string;
    nivel: string;
    tipo: string;
    capacidad: number;
    stock_actual: number;
    estado: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
  }
class AdministarAlmance {
    static async getAll(): Promise<Almacen[]> {
        try {
            const [rows] = await pool.query('SELECT * FROM almacenes WHERE status = "activo"');
            return rows as Almacen[];
        } catch (error) {
            console.error('Error en modelo getAll:', error);
            throw error; // Propaga el error para manejarlo en el controlador
        }
    }
    
    static async getByName(nombre: string): Promise<Almacen[]> {
        const [rows] = await pool.query('SELECT * FROM almacenes WHERE nombre LIKE ? AND status = "activo"', [`%${nombre}%`]);
        return rows as Almacen[];
    }
    
    static async add(almacen: Almacen): Promise<number> {
        const [result] = await pool.query('INSERT INTO almacenes SET ?', [almacen]);
        return (result as any).insertId;
    }
    
    static async update(id: number, almacen: Almacen): Promise<void> {
        await pool.query('UPDATE almacenes SET ? WHERE id = ?', [almacen, id]);
    }
    
    static async delete(id: number): Promise<void> {
        await pool.query('UPDATE almacenes SET status = "inactivo"  WHERE id = ?',[id]);
        
    }
    static async showFinalId(){
        const sql = `SELECT CONCAT('ALM-', LPAD(COALESCE(MAX(CAST(SUBSTRING(codigo, 5) AS UNSIGNED)), 0) + 1, 3, '0')) AS proximo_codigo
                        FROM almacenes`;
                        
        const [rows] = await pool.query(sql);
        return rows;

    }
    static async getUbicaciones(almacenId: number): Promise<Ubicacion[]> {
        const [rows] = await pool.query('SELECT * FROM ubicaciones_picking WHERE almacen_id = ? and estado = "activo"', [almacenId]);
        return rows as Ubicacion[];
    }
    static async postUbicacion(ubicacion: Ubicacion){
        try {
            const [rows] = await pool.query('INSERT INTO ubicaciones_picking SET ?', [ubicacion]);
            return rows;
        } catch (error) {
            console.error('Error en modelo postUbicacion:', error);
            throw error;
        }
    }
    static async putUbicacion(id: number, ubicacion: Ubicacion) {
        const [rows] = await pool.query('UPDATE ubicaciones_picking SET columna = ?, posicion = ?, nivel = ?, tipo = ?, capacidad = ?, stock_actual = ?, estado = ? WHERE id = ?', [ubicacion.columna, ubicacion.posicion, ubicacion.nivel, ubicacion.tipo, ubicacion.capacidad, ubicacion.stock_actual, ubicacion.estado, id]);
        return rows;
    }
    static async getUsuarios(almacenId: number) {
        const sql = `select a.id, a.almacen_id,a.user_id,u.phone,name,email
                        from almacenUserTable a inner join users u on u.id = a.user_id
                        where a.almacen_id = ?`;
        const [rows] = await pool.query(sql, [almacenId]);
        return rows ;
    }
    static async addUsuarioAlmacen(almacenId: number, userId: number) {
        const [rows] = await pool.query('INSERT INTO almacenUserTable (almacen_id, user_id) VALUES (?, ?)', [almacenId, userId]);
        return rows;
    }
    static async getUsuariosDisponibles() {
        const [rows] = await pool.query(' SELECT a.id, a.username, a.email, a.name, a.phone, b.id as id_almacenUSer FROM users a left join almacenUserTable b on a.id = b.user_id WHERE a.role <> "driver" ');
        return rows;
    }
    static async removeUsuarioAlmacen(userId: number) {
        const [rows] = await pool.query('DELETE FROM almacenUserTable WHERE user_id = ?', [userId]);
        return rows;
    }
    static async deleteUbicacion(id: number) {
        const [rows] = await pool.query('UPDATE ubicaciones_picking SET estado = "inactivo" WHERE id = ?', [id]);
        return rows;
    }
}

export default AdministarAlmance;