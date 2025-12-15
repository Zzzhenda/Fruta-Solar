// my-new-project/src/shared/Navbar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const { usuarioActual, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const esHomepage = location.pathname === '/';

  return (
    <header className={esHomepage ? 'header-transparente' : ''}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid px-4">

          <Link className="navbar-brand text-white d-flex align-items-center" to="/">
            <img src="/images/icono.png" alt="Icono Fruto Solar" width="60" height="60" className="me-2" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>Fruto Solar</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" style={{ filter: esHomepage ? 'brightness(0) invert(1)' : 'none' }}></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item me-3"><NavLink className="nav-link btn btn-success text-white" to="/impacto">Impacto</NavLink></li>
              <li className="nav-item me-3"><NavLink className="nav-link btn btn-success text-white" to="/catalogo">Catálogo</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link btn btn-success text-white" to="/contacto">Contacto</NavLink></li>
            </ul>

            <ul className="navbar-nav d-flex flex-row align-items-center">
              <li className="nav-item me-3">
                <Link className="nav-link btn btn-success text-white position-relative" to="/carrito">
                  Carrito
                  {totalItems > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{totalItems}</span>}
                </Link>
              </li>

              {usuarioActual ? (
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link btn btn-success text-white" to="/perfil">Hola, {usuarioActual.nombre}</Link>
                  </li>
                  
                  {/* ESTA ES LA PARTE QUE AHORA FUNCIONARÁ */}
                  {usuarioActual.rol === 'administrador' && (
                    <li className="nav-item me-3">
                      <Link className="nav-link btn btn-warning text-dark fw-bold" to="/admin">Panel Admin</Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <button className="nav-link btn btn-danger text-white" onClick={logout}>Cerrar Sesión</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item me-3"><Link className="nav-link btn btn-success text-white" to="/login">Login</Link></li>
                  <li className="nav-item"><Link className="nav-link btn btn-success text-white" to="/registro">Registro</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}