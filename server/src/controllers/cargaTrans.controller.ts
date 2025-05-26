import { Request, Response } from 'express';
import TransporteModel from '../models/AdmCreateTransporte.models';

class CargaTransportes {
    static async getAll(req: Request, res: Response) {
      try {
        
        const transportes = await TransporteModel.getAll('CARGANDO');
        res.json(transportes);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los transportes' });
      }
    }
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const transporte = await TransporteModel.getById(id);
      if (!transporte) {
        res.status(404).json({ message: 'Transporte no encontrado' });
        return
      }
  
      res.json(transporte);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el transporte' });
    }
  }
  static async finishCarga(req: Request, res: Response): Promise<void> { 
    const { id } = req.params;

    try {
      const transporte = await TransporteModel.finishCarga(id);
      res.json(transporte);
    } catch (error) {
      res.status(500).json({ message: 'Error al Finalizar la carga' });
    }   
  }
}
export default CargaTransportes;