import { RowDataPacket } from "mysql2";
import db from "../utils/db";

export interface Vehiculo extends RowDataPacket {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  placa: string;
}

class VehiculoModel {
  // Obtener todos los vehículos
  static async getAll(): Promise<Vehiculo[]> {
    const [rows] = await db.query<Vehiculo[]>("SELECT * FROM vehiculos");
    return rows;
  }

  // Crear un nuevo vehículo
  static async create(marca: string, modelo: string, año: number, color: string, placa: string): Promise<any> {

    const query = "INSERT INTO vehiculos (marca, modelo, año, color, placa) VALUES (?, ?, ?, ?, ?)";

    const [results] = await db.query(query, [marca, modelo, año, color, placa]);
    return results;
  }

  // Actualizar un vehículo
  static async update(id: number, marca: string, modelo: string, año: string, color: string, placa: string): Promise<any> {
    console.log(marca, modelo, año, color, placa, id);
    

    const query = "UPDATE vehiculos SET marca = ?, modelo = ?, año = ?, color = ?, placa = ? WHERE id = ?";
    const [results] = await db.query(query, [marca, modelo, año, color, placa, id]);
    console.log('Prueba despues')
    return results;
  }

  // Eliminar un vehículo
  static async delete(id: number): Promise<any> {
    const query = "UPDATE vehiculos SET status = 'inactivo' WHERE id = ?";
    const [results] = await db.query(query, [id]);
    return results;
  }
}

export default VehiculoModel;