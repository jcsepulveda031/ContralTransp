import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface PhotoModalProps {
  onClose: () => void;
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ onClose, selectedFile, onFileChange }) => {
  return (
    <Box className="modal-box">
      <h2>Cambiar Foto</h2>
      <div className="profile-preview-container">
        <div className="profile-preview">
          {selectedFile ? (
            <img 
              src={URL.createObjectURL(selectedFile)}
              alt="Preview" 
              className="profile-preview-image"
            />
          ) : (
            <img 
              src="https://i.pravatar.cc/40"
              alt="Preview" 
              className="profile-preview-image"
            />
          )}
        </div>
      </div>
      <input 
        type="file" 
        onChange={onFileChange}
        accept="image/*"
        style={{ margin: '20px 0' }}
      />
      <Button variant="contained" color="primary" fullWidth>
        Subir
      </Button>
    </Box>
  );
};

export default PhotoModal; 