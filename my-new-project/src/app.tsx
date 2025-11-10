import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Navbar } from './shared/Navbar';
import { Footer } from './shared/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Notifications } from './components/Notifications';

// --- Páginas Cliente (Lazy) ---
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Catalogo = lazy(() => import('./pages/Catalogo').then(module => ({ default: module.Catalogo })));
const Impacto = lazy(() => import('./pages/Impacto').then(module => ({ default: module.Impacto })));
const Contacto = lazy(() => import('./pages/Contacto').then(module => ({ default: module.Contacto })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Registro = lazy(() => import('./pages/Registro').then(module => ({ default: module.Registro })));
const Carrito = lazy(() => import('./pages/Carrito').then(module => ({ default: module.Carrito })));
const Perfil = lazy(() => import('./pages/Perfil').then(module => ({ default: module.Perfil })));

// --- Páginas Admin (Lazy) ---
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminProductos = lazy(() => import('./pages/admin/AdminProductos').then(module => ({ default: module.AdminProductos })));
const AdminPedidos = lazy(() => import('./pages/admin/AdminPedidos').then(module => ({ default: module.AdminPedidos })));
const AdminUsuarios = lazy(() => import('./pages/admin/AdminUsuarios').then(module => ({ default: module.AdminUsuarios })));
const AdminReportes = lazy(() => import('./pages/admin/AdminReportes').then(module => ({ default: module.AdminReportes })));

function App() {
  return (
    <>
      <Navbar />
      <Notifications />
      <main style={{ minHeight: '80vh' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/impacto" element={<Impacto />} />
            <Route path="/contacto" element={<Contacto />} />
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
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;