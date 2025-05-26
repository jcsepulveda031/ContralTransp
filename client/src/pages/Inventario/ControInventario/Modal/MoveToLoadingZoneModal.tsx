import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { LocationWithDetails, UnidadLogistica } from '../../../../types/types';

interface MoveToLoadingZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (unidadId: number, cantidad: number) => Promise<void>;
  ubicaciones: LocationWithDetails[];
}

const MoveToLoadingZoneModal: React.FC<MoveToLoadingZoneModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ubicaciones,
}) => {
  const [selectedUnidad, setSelectedUnidad] = useState<UnidadLogistica | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedUnidad(null);
      setCantidad(0);
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedUnidad) {
      setError('Por favor seleccione una unidad');
      return;
    }
    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    if (cantidad > (selectedUnidad as any).cantidadDisponible) {
      setError('No hay suficiente cantidad disponible');
      return;
    }
    try {
      setLoading(true);
      await onConfirm(selectedUnidad.id, cantidad);
      onClose();
    } catch (err) {
      setError('Error al mover la unidad a la zona de carga');
    } finally {
      setLoading(false);
    }
  };

  // Unidades disponibles de todas las ubicaciones
  const availableUnits = ubicaciones.flatMap(location =>
    location.unidades.map(u => ({
      ...u.unidad,
      ubicacionId: location.id,
      ubicacionNombre: `${location.columna}${location.nivel}${location.posicion}`,
      cantidadDisponible: u.cantidad
    }))
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Mover a Zona de Carga</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ubicación</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad Disponible</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableUnits.map((unidad) => (
                <TableRow key={`${unidad.id}-${unidad.ubicacionId}`}>
                  <TableCell>{unidad.ubicacionNombre}</TableCell>
                  <TableCell>{unidad.sku}</TableCell>
                  <TableCell>{unidad.tipo}</TableCell>
                  <TableCell>{unidad.cantidadDisponible}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedUnidad(unidad);
                        setCantidad(1);
                        setError('');
                      }}
                      disabled={unidad.cantidadDisponible <= 0}
                    >
                      Seleccionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedUnidad && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Unidad seleccionada: {selectedUnidad.sku} ({selectedUnidad.tipo})
            </Typography>
            <TextField
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Math.min(Number(e.target.value), (selectedUnidad as any).cantidadDisponible))}
              inputProps={{ min: 1, max: (selectedUnidad as any).cantidadDisponible }}
              fullWidth
              margin="normal"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!selectedUnidad || cantidad <= 0 || loading}
        >
          {loading ? 'Procesando...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveToLoadingZoneModal;
