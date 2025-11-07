// src/pages/admin/AdminUsuarios.tsx
import { useState, useEffect } from 'react';
import { useAuth, type Usuario } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export function AdminUsuarios() {
  const { usuarioActual, getAllUsuarios, editarUsuario, eliminarUsuario } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Protección de ruta
  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  // Cargar usuarios al montar o cuando cambie algo relevante
  useEffect(() => {
    refrescarUsuarios();
  }, [getAllUsuarios, usuarioActual]); // Dependencia usuarioActual por si se edita a sí mismo

  const refrescarUsuarios = () => {
    setUsuarios(getAllUsuarios());
  };

  const mostrarMensaje = (tipo: 'success' | 'danger' | 'warning', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const handleEditarClick = (usuario: Usuario) => {
    setUsuarioEnEdicion({ ...usuario }); // Copia para no mutar directamente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminarClick = (correo: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${correo}? Esta acción es irreversible.`)) {
      const exito = eliminarUsuario(correo);
      if (exito) {
        mostrarMensaje('warning', 'Usuario eliminado correctamente.');
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
      mostrarMensaje('success', 'Usuario actualizado correctamente.');
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
          <i className="bi bi-arrow-left"></i> Volver al Panel
        </Link>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      <div className="row g-4">
        {/* PANEL DE EDICIÓN (Solo visible si hay un usuario seleccionado) */}
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
                           value={usuarioEnEdicion.telefono} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion"
                           value={usuarioEnEdicion.direccion} onChange={handleChange} />
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

        {/* LISTA DE USUARIOS (Ocupa todo el ancho si no se está editando) */}
        <div className={usuarioEnEdicion ? "col-lg-8" : "col-12"}>
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
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
                             {usuario.telefono ? <div>📞 {usuario.telefono}</div> : null}
                             {usuario.direccion ? <div className="text-truncate" style={{maxWidth: '150px'}}>📍 {usuario.direccion}</div> : null}
                             {!usuario.telefono && !usuario.direccion && <span className="text-muted">-</span>}
                           </small>
                        </td>
                        <td className="text-end pe-4">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleEditarClick(usuario)} title="Editar usuario">
                              ✏️
                            </button>
                            {/* Deshabilitamos el botón de eliminar si es el propio usuario actual */}
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
      </div>
    </main>
  );
}