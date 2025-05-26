import { Request, Response } from 'express';
import HistorialTransporteModels from '../models/HistorialTransporte.models';

class HistorialTransporteController {
    static async getHistorial(req: Request, res: Response) {
        try {
            const historial = await HistorialTransporteModels.getHistorial();
            res.json({status: 'OK', data: historial});
        } catch (error) {
            res.json({status: 'ERROR', data: 'Error al obtener el historial de transportes' });
        }
    }
}

export default HistorialTransporteController;

