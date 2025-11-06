import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importa Auth
import { useCart } from '../context/CartContext'; // 2. Importa Cart

export function Navbar() {
  const { usuarioActual, logout } = useAuth(); // 3. Obtiene el usuario y la función logout
  const { totalItems } = useCart(); // 4. Obtiene el total de items del carrito

  return (
    <header className="header-transparente">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid px-4">

          <Link className="navbar-brand text-white d-flex align-items-center" to="/">
            <img src="/images/icono.png" alt="Icono Fruto Solar" width="60" height="60" className="me-2" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>Fruto Solar</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {/* 5. Usamos NavLink para "active" class (opcional pero recomendado) */}
              <li className="nav-item me-3">
                <NavLink className="nav-link btn btn-success text-white" to="/impacto">Impacto</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link btn btn-success text-white" to="/catalogo">Catálogo</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link btn btn-success text-white" to="/contacto">Contacto</NavLink>
              </li>
            </ul>

            {/* 6. LÓGICA DINÁMICA - Reemplaza tu js/ui.js */}
            <ul className="navbar-nav d-flex flex-row align-items-center">

              <li className="nav-item me-3">
                <Link className="nav-link btn btn-success text-white position-relative" to="/carrito">
                  Carrito
                  {/* Muestra el número de items si es mayor a 0 */}
                  {totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>

              {/* 7. Renderizado condicional */}
              {usuarioActual ? (
                // *** SI HAY USUARIO LOGUEADO ***
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link btn btn-success text-white" to="/perfil">
                      Hola, {usuarioActual.nombre}
                    </Link>
                  </li>

                  {/* Botón de Admin (como en js/ui.js) */}
                  {usuarioActual.rol === 'administrador' && (
                    <li className="nav-item me-3">
                      {/* ANTES: <a href="/admin.html" ...> */}
                      {/* AHORA: Usamos Link de React Router */}
                      <Link className="nav-link btn btn-warning text-dark fw-bold" to="/admin">
                        Panel Admin
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-danger text-white"
                      onClick={logout} // Llama a la función del contexto
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                // *** SI ES INVITADO ***
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link btn btn-success text-white" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link btn btn-success text-white" to="/registro">Registro</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}