import express from "express";
import VehiculoController from "../controllers/admVehiculo.Controller"; 

const router = express.Router();

// Rutas para vehículos
router.get("/", VehiculoController.getAll);
router.post("/", VehiculoController.create); // Asegúrate de que esta línea esté presente
router.put("/:id", VehiculoController.update);
router.delete("/:id", VehiculoController.deleteVehiculo);

export default router;