import { Routes, Route, Navigate } from 'react-router-dom';

// Importaremos nuestros futuros componentes y páginas
import { Navbar } from './shared/Navbar';
import { Footer } from './shared/Footer';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Impacto } from './pages/Impacto';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Carrito } from './pages/Carrito';

function App() {
  return (
    <>
      {/* 1. El Navbar es persistente, va FUERA de <Routes> */}
      <Navbar />

      <main>
        {/* 2. <Routes> es el cerebro que decide qué página mostrar */}
        <Routes>
          {/* 3. Mapeo de rutas: URL -> Componente de Página */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/impacto" element={<Impacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          
          {/* 4. Opcional: Redirige cualquier ruta no encontrada al Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* 5. El Footer también es persistente */}
      <Footer />
    </>
  );
}

export default App;