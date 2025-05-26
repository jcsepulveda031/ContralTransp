import pool from '../utils/db';
import {  RowDataPacket} from 'mysql2/promise';


interface ProximoIdentificador extends RowDataPacket {
  proximo_identificador: string;
}
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
class TransporteModel {

    
  static async getAll(estado: string) {
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
                WHERE t.estado in ( 'NUEVO', 'CARGANDO' )` ;
    
    
    const [rows] = await pool.query(query,estado);
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
        WHERE t.id = ?
    `;

    const [rows] = await pool.query(query, [id]);
    return rows;
}

  static async create(transporte: Omit<Transporte, 'id'  |'fecha_creacion' | 'hora_creacion' | 'estado'>) {
    const now = new Date();
    const fecha_creacion = now.toISOString().split('T')[0];
    const hora_creacion = now.toTimeString().split(' ')[0];
    
    const [result]: any = await pool.query(
      'INSERT INTO transportes SET ?', 
      {...transporte, fecha_creacion, hora_creacion, estado: 'NUEVO'}
    );

    const transporteId = result.insertId;
    
    // Actualiza los estados del conductor y del vehiculo
    if (result) {
      await pool.query(
        'UPDATE conductores SET status = "ocupado" WHERE id = ? AND status = "activo"', [transporte.conductor_id]
        );
      await pool.query(
        'UPDATE vehiculos SET status = "ocupado" WHERE id = ? AND status = "activo"', [transporte.vehiculo_id]
        );
        

      await pool.query( 'INSERT INTO seguimiento_transportes ( transporte_id, conductor_id ) VALUE ( ?, ? )', [ transporteId, transporte.conductor_id ])
      
    }
    
    return result;
  }

  static async update(id: number, transporte: Partial<Transporte>){
    // Convertir fecha_creacion a formato MySQL si existe
    if (transporte.fecha_creacion) {
        transporte.fecha_creacion = new Date(transporte.fecha_creacion)
            .toISOString()
            .replace('T', ' ')
            .replace(/\..+/, '');
    }
    
    try {
      // 1. Obtener el transporte actual para comparar cambios
      const [currentTransporte] = await pool.query<Transporte[]>(
        'SELECT conductor_id, vehiculo_id FROM transportes WHERE id = ?', 
        [id]
    );

        if (currentTransporte.length === 0) {
          throw new Error('Transporte no encontrado');
        } 

        const current = currentTransporte[0];

        // 2. Actualizar el transporte (solo si está en estado NUEVO)
        const [updateResult] = await pool.query(
          'UPDATE transportes SET ? WHERE id = ? AND estado = "NUEVO"', 
          [transporte, id]
      );
      if (!updateResult) {
        throw new Error('No se pudo actualizar: El transporte no está en estado NUEVO o no existe');
    }

    // 3. Manejar cambios de conductor
    if (transporte.conductor_id && transporte.conductor_id !== current.conductor_id) {
        // Liberar conductor anterior (si existía)
        if (current.conductor_id) {
            await pool.query(
                'UPDATE conductores SET status = "activo" WHERE id = ? AND status = "ocupado"',
                [current.conductor_id]
            );
        }
        
        // Ocupar nuevo conductor
        await pool.query(
            'UPDATE conductores SET status = "ocupado" WHERE id = ? ',
            [transporte.conductor_id]
        );
    }

    // 4. Manejar cambios de vehículo
    if (transporte.vehiculo_id && transporte.vehiculo_id !== current.vehiculo_id) {
        // Liberar vehículo anterior (si existía)
        if (current.vehiculo_id) {
            await pool.query(
                'UPDATE vehiculos SET status = "activo" WHERE id = ? ',
                [current.vehiculo_id]
            );
        }
        
        // Ocupar nuevo vehículo
        await pool.query(
            'UPDATE vehiculos SET status = "ocupado" WHERE id = ? ',
            [transporte.vehiculo_id]
        );
    }

    return updateResult;

  } catch (error) {

  }
}

  static async delete(id: number) {

    const [result] = await pool.query('UPDATE transportes SET estado = "CANCELADO" WHERE id = ? AND estado = "NUEVO"', [id]);

    const [currentTransporte] = await pool.query<Transporte[]>(
      'SELECT conductor_id, vehiculo_id FROM transportes WHERE id = ?', 
      [id]
    );

    const current = currentTransporte[0];

    await pool.query(
      'UPDATE conductores SET status = "activo" WHERE id = ? ',
      [current.conductor_id]
    );

    await pool.query(
      'UPDATE vehiculos SET status = "activo" WHERE id = ? ',
      [current.vehiculo_id]
  );


    //const [result] = await pool.query(' DELETE FROM transportes WHERE id = ? AND estado = "NUEVO"', [id]);
    return result;
  }

  static async getSearchConductor(cedula: string) { 
    const [rows] = await pool.query('SELECT * FROM conductores WHERE cedula = ?', [cedula]);
    return rows;

  }
  static async getSearchAlmacen(codigo: string) {
    const [rows] = await pool.query('SELECT * FROM almacenes WHERE codigo = ?', [codigo]);
    return rows;
  }

  static async getSearchVehiculo(placa:string ): Promise<any> {
    const results = await pool.query(
      'SELECT * FROM vehiculos WHERE placa = ?', [placa]);
    return results[0];
  }
  static async getSearchTransporte(codigo:string) : Promise<any> {
    const results = await pool.query(
      'SELECT * FROM transportes WHERE identificador = ?', [codigo]);
    return results[0];
  }

  static async showFinalTransp() {
    const query = `
                SELECT CONCAT('TRANS-', LPAD(COALESCE(MAX(CAST(SUBSTRING(identificador, 7) AS UNSIGNED)), 0) + 1, 3, '0')) AS proximo_identificador
                  FROM transportes`;
                  const [rows] = await pool.query(query);
                  return rows;
  }
  static async finishCarga(id: string) {
    const  sql = `UPDATE transportes SET estado = 'CARGADO' WHERE id = ?`
    const [rows] = await pool.query(sql, [id]);
    
    return rows;
  }
  }


export default TransporteModel;