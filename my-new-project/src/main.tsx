import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // Asegúrate de que coincida con el nombre del archivo (App.tsx o app.tsx)
import './style.css';

// Importaciones de Bootstrap (Estilos globales)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Ya no necesitamos BrowserRouter ni Providers aquí 
       porque están todos dentro de <App /> 
    */}
    <App />
  </React.StrictMode>
);