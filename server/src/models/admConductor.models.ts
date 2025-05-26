import pool from '../utils/db';

import { Conductor, User } from '../interfaces/IUser';



class ConductorModel {
  // Obtener todos los conductores
  static async getAll(): Promise<Conductor[]> {
    const [rows] = await pool.query('SELECT c.*, u.username FROM conductores c left join users u on c.userid = u.id WHERE c.status <> "inactivo"');
    return rows as Conductor[];
  }

  // Agregar un nuevo conductor
  static async add(conductor: Conductor): Promise<void> {

    const { cedula, nombre, telefono, direccion, email, licencia } = conductor.params;
    const [result]  = await pool.query<Conductor[]>('SELECT * FROM conductores WHERE cedula = ?', [cedula]);

      if (result.length == 0) {

        await pool.query(
          'INSERT INTO conductores (cedula, nombre, telefono, direccion, email, licencia) VALUES (?, ?, ?, ?, ?, ? )',
          [cedula, nombre, telefono, direccion, email, licencia]
        );
      } else {

        throw new Error('Error: el conductor ya existe');
        }
            
  }

  // Actualizar un conductor existente
  static async update(cedula: string, conductor: Conductor): Promise<void> {
    const { nombre, telefono, direccion, email, licencia } = conductor.params;
    console.log(conductor);
    await pool.query(
      'UPDATE conductores SET nombre = ?, telefono = ?, direccion = ?, email = ?, licencia = ? WHERE cedula = ?',
      [nombre, telefono, direccion, email, licencia, cedula]
    );
  }

  // Eliminar un conductor
  static async delete(id: number): Promise<void> {
    await pool.query('UPDATE conductores SET status = "inactivo" WHERE id  = ?', [id]);
  }

  static async getById(cedula: string) {
    const [rows] = await pool.query('SELECT * FROM conductores WHERE cedula = ?', [cedula]);
    return rows;
  }

  static async UpdateUserDriver(id: number, user: User): Promise<void> { 
    // Crear un nuevo usuario

    const query = 'INSERT INTO users (username, email, name, age, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [user.username, user.email, user.name, user.age, user.phone, user.password, user.role];
    const [result]: any = await pool.query(query, values);
    const UserId = result.insertId;

    if (UserId) {
      await pool.query('UPDATE conductores SET userId = ? WHERE id = ?', [UserId,id] );
    }
    return result;
  }
  static async getUserForConductor(user_id: number): Promise<User[]> {
    const [rows] = await pool.query('SELECT username, password FROM users WHERE id = ?', [user_id]);
    return rows as User[];
  }
}




export default ConductorModel;
