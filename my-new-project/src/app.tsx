// src/app.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

import { Navbar } from './shared/Navbar';
import { Footer } from './shared/Footer';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Impacto } from './pages/Impacto';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Carrito } from './pages/Carrito';
import { Perfil } from './pages/Perfil'; // <--- 1. IMPORTA EL COMPONENTE PERFIL
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductos } from './pages/admin/AdminProductos';
import { AdminPedidos } from './pages/admin/AdminPedidos';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminReportes } from './pages/admin/AdminReportes';
function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}> {/* Añadí minHeight para que el footer no suba si hay poco contenido */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/impacto" element={<Impacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/perfil" element={<Perfil />} /> 
          <Route path="/admin" element={<AdminDashboard />} /> 
          <Route path="/admin/productos" element={<AdminProductos />} /> 
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;