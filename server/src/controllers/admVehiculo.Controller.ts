import { Request, Response } from "express";
import  VehiculoModel  from "../models/admVehiculo.models";


class VehiculoController {

    // Obtener todos los vehículos
    static async getAll(req: Request, res: Response): Promise<void>  {
        try {
            const vehiculos = await VehiculoModel.getAll();
            res.json(vehiculos);
          } catch (err) {
            res.status(500).json({ error: err instanceof Error ? err.message : "Error desconocido" });
          } 
    };

    // Crear un nuevo vehículo
    static async create(req: Request, res: Response): Promise<void> { 
        const { marca, modelo, año, color, placa } = req.body.params;
        console.log(req);
        try {
          const results = await VehiculoModel.create(marca, modelo, año, color, placa);
          res.json({ id: results.insertId, marca, modelo, año, color, placa });
        } catch (err) {
          res.status(500).json({ error: err instanceof Error ? err.message : "Error desconocido" });
        }
    };

    // Actualizar un vehículo
    static async update(req: Request, res: Response): Promise<void> { 
        const { id } = req.params;
        
        const { marca, modelo, año, color, placa } = req.body;
        console.log('Prueba datos ',req)
        try {
          await VehiculoModel.update(Number(id), marca, modelo, año, color, placa);
          res.json({ id, marca, modelo, año, color, placa });
        } catch (err) {
          res.status(500).json({ error: err instanceof Error ? err.message : "Error desconocido" });
        }
    };
    // Eliminar un vehículo
    static async deleteVehiculo(req: Request, res: Response): Promise<void> {
      console.log(req.params);
        const  id  = parseInt(req.params.id);
        try {
          await VehiculoModel.delete(id);
          res.json({ message: "Vehículo eliminado correctamente" });
        } catch (err) {
          res.status(500).json({ error: err instanceof Error ? err.message : "Error desconocido" });
        }
    };
        

}

export default VehiculoController;