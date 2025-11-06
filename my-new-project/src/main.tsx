import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

// 1. Importa el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// 2. Importa tu CSS personalizado
import './style.css'; 

// 3. IMPORTA LOS NUEVOS PROVEEDORES
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 4. Envuelve la App con el enrutador */}
    <BrowserRouter>
      {/* 5. Envuelve todo con los proveedores de contexto */}
      {/* AuthProvider va primero porque otros contextos pueden depender de él */}
      <AuthProvider>
        <ProductProvider>
          {/* CartProvider necesita AuthProvider y ProductProvider, así que va dentro */}
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);