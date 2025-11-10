// src/pages/Perfil.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext'; // <-- IMPORTAR

export function Perfil() {
  const { usuarioActual, logout, actualizarDatosUsuario } = useAuth();
  const { addNotification } = useNotification(); // <-- OBTENER HOOK
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: usuarioActual?.nombre || '',
    telefono: usuarioActual?.telefono || '',
    direccion: usuarioActual?.direccion || '',
  });

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exito = actualizarDatosUsuario(formData);
    if (exito) {
      setIsEditing(false);
      addNotification("Perfil actualizado con éxito", 'success'); // <-- NOTIFICACIÓN
    } else {
      addNotification("Error al actualizar el perfil", 'danger');
    }
  };

  return (
    <main className="container my-5">
      <h1 className="mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Mi Perfil</h1>
      
      <div className="row g-4">
        {/* Tarjeta de Datos Personales */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-success text-white py-3">
              <h5 className="mb-0">Mis Datos Personales</h5>
            </div>
            
            {!isEditing ? (
              // --- VISTA DE SOLO LECTURA ---
              <div className="card-body">
                <div className="mb-3">
                  <label className="small text-muted">Nombre completo</label>
                  <p className="fw-medium fs-5">{usuarioActual.nombre}</p>
                </div>
                <div className="mb-3">
                  <label className="small text-muted">Correo electrónico</label>
                  <p className="fw-medium">{usuarioActual.correo}</p>
                </div>
                <div className="mb-3">
                  <label className="small text-muted">Teléfono</label>
                  <p>{usuarioActual.telefono || <em className="text-muted">No especificado</em>}</p>
                </div>
                <div className="mb-4">
                  <label className="small text-muted">Dirección de envío</label>
                  <p>{usuarioActual.direccion || <em className="text-muted">No especificada</em>}</p>
                </div>
                
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </button>
                  <button className="btn btn-outline-danger" onClick={logout}>
                    Cerrar Sesión
                  </button>
                </div>
              </div>

            ) : (
              // --- VISTA DE EDICIÓN ---
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={usuarioActual.correo}
                      disabled
                      readOnly
                    />
                    <div className="form-text">El correo no se puede modificar.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Dirección de envío</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success">Guardar Cambios</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de Historial de Pedidos */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0">Historial de Pedidos</h5>
            </div>
            <div className="card-body p-0">
              {usuarioActual.pedidos && usuarioActual.pedidos.length > 0 ? (
                <div className="list-group list-group-flush">
                  {usuarioActual.pedidos.map((pedido) => (
                    <div key={pedido.id} className="list-group-item p-4">
                      <div className="d-flex w-100 justify-content-between align-items-center mb-3">
                        <h6 className="mb-1 fw-bold">Pedido #{pedido.id}</h6>
                        <small className={`badge ${pedido.estado === 'Entregado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {pedido.estado}
                        </small>
                      </div>
                      <p className="mb-2 text-muted small">
                        Realizado el {pedido.fecha} a las {pedido.hora}
                      </p>
                      <ul className="mb-3 ps-3">
                        {pedido.productos.map((prod, idx) => (
                            <li key={idx} className="small">
                              {prod.cantidad}x {prod.nombre} - ${(prod.precio * prod.cantidad).toLocaleString('es-CL')}
                            </li>
                        ))}
                      </ul>
                      <h5 className="text-end text-success mb-0">
                        Total: ${pedido.total.toLocaleString('es-CL')}
                      </h5>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-5">
                  <p className="text-muted mb-3 fs-5">Aún no has realizado ningún pedido.</p>
                  <a href="/catalogo" className="btn btn-success">Ir a comprar</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}