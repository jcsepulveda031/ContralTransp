import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <Box className="modal-box">
      <h2>Actualizar Información</h2>
      <TextField label="Nombre" fullWidth margin="normal" />
      <TextField label="Correo" fullWidth margin="normal" />
      <TextField label="Año" fullWidth margin="normal" />
      <TextField label="Teléfono" fullWidth margin="normal" />
      <TextField label="Dirección" fullWidth margin="normal" />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Guardar
      </Button>
    </Box>
  );
};

export default InfoModal; 