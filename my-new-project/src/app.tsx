import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';

// Componentes UI
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
    /* CORRECCIÓN IMPORTANTE DE ORDEN:
       1. NotificationProvider va PRIMERO para que todos (Auth, Product, Cart) puedan lanzar alertas.
       2. AuthProvider suele ir segundo para manejar usuario.
       3. ProductProvider tercero.
       4. CartProvider cuarto.
    */
    <NotificationProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <Navbar />
              <Notifications />
              <main style={{ minHeight: '80vh' }}>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/impacto" element={<Impacto />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    
                    {/* Rutas Privadas Cliente */}
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/perfil" element={<Perfil />} />
                    
                    {/* Rutas Admin */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/productos" element={<AdminProductos />} />
                    <Route path="/admin/pedidos" element={<AdminPedidos />} />
                    <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                    <Route path="/admin/reportes" element={<AdminReportes />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;