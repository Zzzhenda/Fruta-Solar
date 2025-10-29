// Importamos Link para la navegación SPA
import { Link } from 'react-router-dom';

// Opcional: Si quieres usar los componentes de React-Bootstrap
// import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

export function Navbar() {
  return (
    <header className="header-transparente">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid px-4">
          
          {/* ANTES: era <a ... href="index.html"> */}
          <Link className="navbar-brand text-white d-flex align-items-center" to="/">
            <img src="/images/icono.png" alt="Icono Fruto Solar" width="60" height="60" className="me-2" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>Fruto Solar</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              
              {/* ANTES: <a ... href="impacto.html"> */}
              <li className="nav-item me-3">
                <Link className="nav-link btn btn-success text-white" to="/impacto">Impacto</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-success text-white" to="/catalogo">Catálogo</Link>
              </li>
            </ul>

            <ul id="nav-auth" className="navbar-nav d-flex flex-row">
              <li className="nav-item me-3">
                <Link className="nav-link btn btn-success text-white" to="/carrito">Carrito</Link>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link btn btn-success text-white" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-success text-white" to="/registro">Registro</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}