// src/pages/admin/AdminUsuarios.tsx
import { useState, useEffect } from 'react';
import { useAuth, type Usuario } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

export function AdminUsuarios() {
  const { usuarioActual, getAllUsuarios, editarUsuario, eliminarUsuario } = useAuth();
  const { addNotification } = useNotification();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);

  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  const refrescarUsuarios = () => {
    setUsuarios(getAllUsuarios());
  };

  useEffect(() => {
    refrescarUsuarios();
  }, [usuarioActual]);

  const handleEditarClick = (usuario: Usuario) => {
    setUsuarioEnEdicion({ ...usuario });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminarClick = (correo: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${correo}? Esta acción es irreversible.`)) {
      const exito = eliminarUsuario(correo);
      if (exito) {
        addNotification('Usuario eliminado correctamente.', 'warning');
        refrescarUsuarios();
        if (usuarioEnEdicion?.correo === correo) {
            setUsuarioEnEdicion(null);
        }
      }
    }
  };

  const handleSubmitEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarioEnEdicion) {
      editarUsuario(usuarioEnEdicion);
      addNotification('Usuario actualizado correctamente.', 'success');
      setUsuarioEnEdicion(null);
      refrescarUsuarios();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (usuarioEnEdicion) {
      setUsuarioEnEdicion({
        ...usuarioEnEdicion,
        [e.target.name]: e.target.value
      });
    }
  };

  return (
    <main className="container-fluid px-4 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Gestión de Usuarios</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          Volver al Panel
        </Link>
      </div>

      <div className="row g-4">
        {/* PANEL DE EDICIÓN */}
        {usuarioEnEdicion && (
          <div className="col-lg-4">
            <div className="card shadow border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">✏️ Editando Usuario</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitEdicion}>
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control bg-light" name="correo"
                           value={usuarioEnEdicion.correo} readOnly disabled 
                           title="El correo no se puede editar ya que es el identificador único." />
                    <div className="form-text">No se puede modificar el correo.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input type="text" className="form-control" name="nombre" required
                           value={usuarioEnEdicion.nombre} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol de Usuario</label>
                    <select className="form-select" name="rol" required
                            value={usuarioEnEdicion.rol} onChange={handleChange}>
                      <option value="cliente">Cliente</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                  <hr />
                  <h6 className="text-muted">Datos de contacto opcionales</h6>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" className="form-control" name="telefono"
                           value={usuarioEnEdicion.telefono || ''} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion"
                           value={usuarioEnEdicion.direccion || ''} onChange={handleChange} />
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    <button type="button" className="btn btn-secondary" 
                            onClick={() => setUsuarioEnEdicion(null)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* LISTA DE USUARIOS */}
        <div className={usuarioEnEdicion ? "col-lg-8" : "col-12"}>
          {/* ¡ARREGLO AQUÍ! Se añadió 'admin-table-card' para el fix de CSS */}
          <div className="card shadow-sm border-0 admin-table-card">
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Usuario</th>
                    <th>Rol</th>
                    <th>Contacto</th>
                    <th className="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.correo} className={usuario.correo === usuarioActual.correo ? "table-active" : ""}>
                      <td className="ps-4">
                        <div className="fw-bold">{usuario.nombre}</div>
                        <small className="text-muted">{usuario.correo}</small>
                        {usuario.correo === usuarioActual.correo && 
                          <span className="badge bg-info text-dark ms-2">Tú</span>}
                      </td>
                      <td>
                        {usuario.rol === 'administrador' ? (
                          <span className="badge bg-danger">Administrador</span>
                        ) : (
                          <span className="badge bg-secondary">Cliente</span>
                        )}
                      </td>
                      <td>
                         <small>
                           {usuario.telefono ? <div>📞 {usuario.telefono}</div> : <></>}
                           {usuario.direccion ? <div className="text-truncate" style={{maxWidth: '150px'}}>📍 {usuario.direccion}</div> : <></>}
                           {!usuario.telefono && !usuario.direccion && <span className="text-muted">-</span>}
                         </small>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => handleEditarClick(usuario)} title="Editar usuario">
                            ✏️
                          </button>
                          <button className="btn btn-outline-danger" 
                                  onClick={() => handleEliminarClick(usuario.correo)} 
                                  disabled={usuario.correo === usuarioActual.correo}
                                  title="Eliminar usuario">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}