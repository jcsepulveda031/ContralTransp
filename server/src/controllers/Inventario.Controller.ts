import { Request, Response } from 'express';
import InventarioModels from '../models/Inventario.models';


class InventarioController {
    async getPickingLocations(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const pickingLocations: any = await InventarioModels.getPickingLocations(id);
            
            if (pickingLocations.length === 0) {
                res.json({ status: false, error: 'No se encontraron ubicaciones de picking' });
                return;
            }

            // Agrupamiento
            const grouped: any = {};

            for (const row of pickingLocations) {
                if (!grouped[row.up_id]) {
                    grouped[row.up_id] = {
                        id: row.up_id,
                        almacen_id: row.almacen_id,
                        columna: row.columna,
                        posicion: row.posicion,
                        nivel: row.nivel,
                        tipo: row.tipo,
                        capacidad: row.capacidad,
                        stock_actual: row.stock_actual,
                        estado: row.estado,
                        fecha_creacion: row.up_fecha_creacion,
                        fecha_actualizacion: row.up_fecha_actualizacion,
                        unidades: []
                    };
                }

                if (row.ul_id) {
                    grouped[row.up_id].unidades.push({
                        id: row.uu_id,
                        ubicacion_id: row.up_id,
                        unidad_id: row.ul_id,
                        cantidad: row.uu_cantidad,
                        fecha_actualizacion: row.uu_fecha_actualizacion,
                        unidad: {
                            id: row.ul_id,
                            tipo: row.ul_tipo,
                            codigo: row.ul_codigo,
                            sku: row.ul_sku,
                            cantidad: row.ul_cantidad,
                            peso: row.ul_peso,
                            volumen: row.ul_volumen,
                            dimensiones: row.ul_dimensiones,
                            fecha_creacion: row.ul_fecha_creacion
                        }
                    });
                }
            }

            const result = Object.values(grouped);
            res.json({ status: true, data: result });
        } catch (error) {
            console.error(error);
            res.json({ status: false, error: 'Error al obtener las ubicaciones de picking' });
        }
    }
    async getZonaCarga(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const zonaCarga: any = await InventarioModels.getZonaCarga(Number(id));
    
            if (zonaCarga.length === 0) {
                res.json({ status: true, data: [] });
                return;
            }
    
            const unidades = zonaCarga.map((row: any) => ({
                id: row.zcu_id,
                unidad_id: row.unidad_id,
                estado: row.estado,
                fecha_ingreso: row.fecha_ingreso,
                user_id: row.user_id,
                almacen_id: row.almacen_id,
                unidad: {
                    id: row.ul_id,
                    tipo: row.tipo,
                    codigo: row.codigo,
                    sku: row.sku,
                    cantidad: row.cantidad,
                    peso: row.peso,
                    volumen: row.volumen,
                    dimensiones: row.dimensiones,
                    fecha_creacion: row.fecha_creacion
                }
            }));
    
            // Simular nombre/capacidad (debería venir de otra tabla idealmente)
            const result = {
                id: id,
                name: `Zona de carga ${id}`, // Esto es simulado
                stock_actual: unidades.length,
                capacidad: 100, // Valor fijo o puedes obtenerlo de otra tabla si existe
                unidades
            };
    
            res.json({ status: true, data: result });
        } catch (error) {
            console.error(error);
            res.json({ status: false, error: 'Error al obtener la zona de carga' });
        }
    }
    async moveToLoadingZone(req: Request, res: Response): Promise<void> {
        try {
            const { unidadId, cantidad } = req.body;
            const result = await InventarioModels.moveToLoadingZone(unidadId, cantidad);
            res.json({ status: true, data: result });   
        } catch (error) {
            console.error(error);
            res.json({ status: false, error: 'Error al mover la unidad a la zona de carga' });
        }
    }
    async moveToPickingLocation(req: Request, res: Response): Promise<void> {
        try {
            const { unidadId, cantidad, ubicacionId,zonaUnidadId } = req.body;
            const result = await InventarioModels.moveToPickingLocation(unidadId, cantidad, ubicacionId);
            if(result){
                await InventarioModels.updateZonaUnidad(zonaUnidadId, cantidad);
                await InventarioModels.updateUbicacionesPicking(ubicacionId,cantidad);
                res.json({ status: true, data: result });
            }else{
                res.json({ status: false, error: 'Error al mover la unidad a la ubicación de picking' });
            }
        } catch (error) {
            console.error(error);
            res.json({ status: false, error: 'Error al mover la unidad a la ubicación de picking' });
        }
    }
    async moveToPickingLocationZone(req: Request, res: Response): Promise<void> {
        try {

            const params = req.body;
            const result = await InventarioModels.moveToPickingLocationZone(params.unidad_id, params.cantidad,params.almacen_id,params.user_id);
            if(result){
                // Restar la cantidad de la ubicación de origen info general de picking
                await InventarioModels.updateUbicacionesPickingRest(params.id,params.cantidad);
                // Restar la cantidad de la ubicación de origen unidad 
                await InventarioModels.updateUbicacionesRest(params.id_ubicacion,params.cantidad);
                res.json({ status: true, data: result });
            }else{
                res.json({ status: false, error: 'Error al mover la unidad a la zona de picking' });
            }

        } catch (error) {
            console.error(error);
            res.json({ status: false, error: 'Error al mover la unidad a la zona de picking' });
        }
    }
    
    async postUbicationToUbication(req: Request, res: Response): Promise<void> {
        try {
            const params = req.body;
            const result = await InventarioModels.moveToPickingLocation(params.unidad_id, params.cantidad, params.ubicacion_destino_id );
            if(result){
                // Restar la cantidad de la ubicación de origen info general de picking
                await InventarioModels.updateUbicacionesPickingRest(params.id,params.cantidad);
                // Restar la cantidad de la ubicación de origen unidad 
                await InventarioModels.updateUbicacionesRest(params.id_ubicacion,params.cantidad);
                await InventarioModels.updateUbicacionesPicking(params.ubicacion_destino_id,params.cantidad);
                
                //await InventarioModels.createMovimientoStock(params.unidad_id, params.cantidad, params.ubicacion_origen_id, params.ubicacion_destino_id);
                res.json({ status: true, data: result });
            }else{
                res.json({ status: false, error: 'Error al crear el movimiento de stock' });
            }
        } catch (error) {
            console.error(error);
            res.json({ status: false, error: 'Error al crear el movimiento de stock' });
        }
    }
}

export default new InventarioController();