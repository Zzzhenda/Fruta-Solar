import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app'; // (Este será nuestro próximo archivo a crear)



// 1. Importa el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// 2. Importa tu CSS personalizado
import './style.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(


  <React.StrictMode>
    {/* 3. Envuelve la App con el enrutador */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>


); 