import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface PasswordModalProps {
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose }) => {
  return (
    <Box className="modal-box">
      <h2>Cambiar Contraseña</h2>
      <TextField 
        label="Contraseña Actual" 
        type="password" 
        fullWidth 
        margin="normal"
      />
      <TextField 
        label="Nueva Contraseña" 
        type="password" 
        fullWidth 
        margin="normal"
        helperText="Debe tener al menos 8 caracteres, incluir una letra mayúscula y un número"
      />
      <TextField 
        label="Confirmar Nueva Contraseña" 
        type="password" 
        fullWidth 
        margin="normal"
        helperText="Debe coincidir con la nueva contraseña"
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Guardar
      </Button>
    </Box>
  );
};

export default PasswordModal; 