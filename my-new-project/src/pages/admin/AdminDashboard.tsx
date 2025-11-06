// src/pages/admin/AdminDashboard.tsx
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export function AdminDashboard() {
  const { usuarioActual } = useAuth();

  // PROTECCIÓN DE RUTA: Solo permitimos acceso si es administrador.
  // Si no está logueado o no es admin, lo mandamos al Home.
  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="container my-5">
      <h1 className="text-center mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
        Panel de Administración
      </h1>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {/* Tarjeta de Productos */}
        <div className="col">
          <div className="card h-100 shadow text-center border-0 bg-light">
            <div className="card-body p-5">
              <div className="display-4 text-success mb-3">
                <i className="bi bi-box-seam"></i> {/* Icono de Bootstrap si lo tienes, o usa emoji  */}
                
              </div>
              <h3 className="card-title">Productos</h3>
              <p className="card-text lead">
                Agrega, edita o elimina productos del catálogo. Controla el stock y precios.
              </p>
              <Link to="/admin/productos" className="btn btn-success btn-lg mt-3">
                Gestionar Productos
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta de Pedidos */}
        <div className="col">
          <div className="card h-100 shadow text-center border-0 bg-light">
            <div className="card-body p-5">
              <div className="display-4 text-success mb-3">
                
              </div>
              <h3 className="card-title">Pedidos</h3>
              <p className="card-text lead">
                Revisa los nuevos pedidos, actualiza sus estados (Enviado, Entregado) y gestiona devoluciones.
              </p>
              <Link to="/admin/pedidos" className="btn btn-success btn-lg mt-3">
                Gestionar Pedidos
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta de Usuarios */}
        <div className="col">
          <div className="card h-100 shadow text-center border-0 bg-light">
            <div className="card-body p-5">
              <div className="display-4 text-success mb-3">
                
              </div>
              <h3 className="card-title">Usuarios</h3>
              <p className="card-text lead">
                Administra las cuentas de clientes. Puedes ver sus detalles o cambiar sus roles.
              </p>
              <Link to="/admin/usuarios" className="btn btn-success btn-lg mt-3">
                Gestionar Usuarios
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta de Reportes */}
        <div className="col">
          <div className="card h-100 shadow text-center border-0 bg-light">
            <div className="card-body p-5">
              <div className="display-4 text-success mb-3">
                
              </div>
              <h3 className="card-title">Reportes</h3>
              <p className="card-text lead">
                Visualiza métricas clave: ingresos totales, productos más vendidos y rendimiento.
              </p>
              <Link to="/admin/reportes" className="btn btn-success btn-lg mt-3">
                Ver Reportes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}