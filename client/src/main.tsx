import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot
import App from './App';


// Selecciona el contenedor con id 'root'
const container = document.getElementById('root');

// Crea un "root" para la aplicación
const root = createRoot(container!); // El signo de exclamación (!) asegura que el contenedor no es null

// Renderiza la aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);