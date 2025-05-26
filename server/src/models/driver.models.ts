import pool from '../utils/db';


class DriverModels {
    static async getInfoDriver(ConductorId:number){ 

        const sql = `SELECT a.*,
                            a_origen.nombre AS almacen_origen_nombre, 
                            a_destino.nombre AS almacen_destino_nombre,
                            a_origen.direccion AS almacen_origen_direccion,
                            a_destino.direccion AS almacen_destino_direccion,
                            v.marca AS vehiculo_marca, 
                            v.placa AS vehiculo_placa
                        from seguimiento_transportes a JOIN transportes t on a.transporte_id = t.id
                                                       JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
                                                       JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
                                                       JOIN conductores c on c.id = a.conductor_id 
                                                       JOIN users u on u.id = c.userId
                                                       JOIN vehiculos v ON t.vehiculo_id = v.id
                        WHERE u.id = ? AND
                              t.estado NOT IN ('COMPLETADO', 'CANCELADO', 'DESCARGADO', 'DESCARGANDO') AND
                              a.estado NOT IN ('FINALIZADO','CANCELADO')` ;  
        

        const [rows] = await pool.query(sql,ConductorId);
        return rows;
    }
    static async postStatusDriverModel(id: number, status: string) {
        const updates: any = { estado: status };
        const now = new Date();
        const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
        if (status === "EN_PROCESO") {
            updates.fecha_inicio = mysqlDate;
        }
  
        if (status === "FINALIZADO") {
            const [transportData] = await pool.query(
                'SELECT fecha_inicio, tiempo_recomendado_horas FROM seguimiento_transportes WHERE id = ?', 
                [id]
            ) as any;
            
            if (transportData[0]?.fecha_inicio) {
                const startDate = new Date(transportData[0].fecha_inicio);
                
                const diffHours = parseFloat(((now.getTime() - startDate.getTime()) / 3600000).toFixed(2));
                
                updates.fecha_fin = mysqlDate;
                updates.tiempo_recorrido_horas = diffHours;
                
                if (transportData[0].tiempo_recomendado_horas) {
                    updates.tiempo_recomendado_horas = transportData[0].tiempo_recomendado_horas;
                }
            }
        }
        console.log('updates',updates);
        const [rows] = await pool.query(
            'UPDATE seguimiento_transportes SET ? WHERE id = ?',
            [updates, id]
        );
        console.log('Resultado update',rows);
        return rows;
    }
    static async postTransportStatus(id:number, estado: string){


        const [transportData] = await pool.query('SELECT a.id, a.transporte_id, a.conductor_id, b.vehiculo_id FROM seguimiento_transportes a inner join transportes b on a.transporte_id = b.id WHERE a.id = ?', id) as any;

        if (transportData[0]?.transporte_id) {
            await pool.query('UPDATE transportes SET estado = ? WHERE id = ?',[estado, transportData[0]?.transporte_id] )
            
        }
        if (transportData[0]?.conductor_id  && estado === "ARRIBADO")   {
            await pool.query('UPDATE conductores SET status = "activo" WHERE id = ?',[ transportData[0]?.conductor_id] )   
        }
        
        if (transportData[0]?.vehiculo_id  && estado === "ARRIBADO")   {
            await pool.query('UPDATE vehiculos SET status = "activo" WHERE id = ?',[ transportData[0]?.vehiculo_id] )
        }
    }
    static async getHistoryDriverModel(ConductorId:number){ 
        const sql = `SELECT a.*,
                            t.identificador,
                            a_origen.nombre AS almacen_origen_nombre, 
                            a_destino.nombre AS almacen_destino_nombre,
                            a_origen.direccion AS almacen_origen_direccion,
                            a_destino.direccion AS almacen_destino_direccion,
                            v.marca AS vehiculo_marca, 
                            v.placa AS vehiculo_placa
                        from seguimiento_transportes a  JOIN transportes t on a.transporte_id = t.id
                                                        JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
                                                        JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
                                                        JOIN conductores c on c.id = a.conductor_id 
                                                        JOIN users u on u.id = c.userId
                                                        JOIN vehiculos v ON t.vehiculo_id = v.id
                        WHERE u.id = ?` ;  
        
        const [rows] = await pool.query(sql,ConductorId);
        return rows;
    }
    static async getHistoryDriverModelById(id:number){ 
        const sql = `SELECT a.*,
                            t.identificador,
                            a_origen.nombre AS almacen_origen_nombre, 
                            a_destino.nombre AS almacen_destino_nombre,
                            a_origen.direccion AS almacen_origen_direccion,
                            a_destino.direccion AS almacen_destino_direccion,
                            v.marca AS vehiculo_marca, 
                            v.placa AS vehiculo_placa
                        from seguimiento_transportes a  JOIN transportes t on a.transporte_id = t.id
                                                        JOIN almacenes a_origen ON t.almacen_origen_id = a_origen.id
                                                        JOIN almacenes a_destino ON t.almacen_destino_id = a_destino.id
                                                        JOIN conductores c on c.id = a.conductor_id 
                                                        JOIN users u on u.id = c.userId
                                                        JOIN vehiculos v ON t.vehiculo_id = v.id
                        WHERE a.id = ?`;
        const [rows] = await pool.query(sql,id);
        return rows;
    }
    static async postDetailDriverModel(id:number, data:any){
        // Get current date and time
        const now = new Date();
        const fecha = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const hora = now.toTimeString().split(' ')[0]; // HH:mm:ss

        const [rows] = await pool.query(
            'INSERT INTO seguimi_transp_details (id_Seguimiento, fecha, hora, detalle) VALUES (?, ?, ?, ?)', 
            [id, fecha, hora, data.detalle]
        );
        console.log(rows)
        return rows;
    }
    static async getDetailDriverModel(id:number){

        const [rows] = await pool.query('SELECT * FROM seguimi_transp_details WHERE id_Seguimiento = ?', [id]);
        return rows;
    }
}

export default DriverModels;