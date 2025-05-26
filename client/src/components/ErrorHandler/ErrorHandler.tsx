import React from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

interface ErrorHandlerProps {
    open: boolean;
    message: string;
    severity: AlertColor;
    onClose: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ErrorHandler; 