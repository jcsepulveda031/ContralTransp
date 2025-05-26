import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';

interface LocationDetail {
  id: string;
  name: string;
  status: string;
  capacidad: number;
  stock: number;
  unidades: { sku: string; unidad: string; cantidad: number }[];
}

interface Props {
  open: boolean;
  location: LocationDetail | null;
  onClose: () => void;
}

const statusLabel = {
  full: 'Lleno',
  partial: 'Parcial',
  empty: 'Vacío',
};
const statusColor = {
  full: 'error',
  partial: 'warning',
  empty: 'success',
};

const LocationDetailsModal: React.FC<Props> = ({ open, location, onClose }) => {
  if (!location) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles de Ubicación - {location.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ background: '#f8f9fa', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Información General
              </Typography>
              <Typography variant="body1">Capacidad Total: <b>{location.capacidad}</b></Typography>
              <Typography variant="body1">Stock Actual: <b>{location.stock}</b></Typography>
              <Typography variant="body1">Espacio Disponible: <b>{location.capacidad - location.stock}</b></Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Estado: <Chip
                  label={statusLabel[location.status as keyof typeof statusLabel]}
                  color={statusColor[location.status as keyof typeof statusColor] as
                    | 'default'
                    | 'success'
                    | 'error'
                    | 'warning'
                    | 'info'
                    | 'primary'
                    | 'secondary'}
                />
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ background: '#f8f9fa', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Unidades en Ubicación
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Unidad</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {location.unidades.map((u, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{u.sku}</TableCell>
                      <TableCell>{u.unidad}</TableCell>
                      <TableCell>{u.cantidad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button variant="contained" color="primary">Confirmar Movimiento</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDetailsModal; 