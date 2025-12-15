import { useState, useEffect } from 'react';
import { useAuth, type Pedido } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export function Perfil() {
  const { usuarioActual, actualizarDatosUsuario, getAllPedidos } = useAuth();
  const { addNotification } = useNotification();
  
  const [misPedidos, setMisPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  });

  // 1. Cargar datos al iniciar
  useEffect(() => {
    if (usuarioActual) {
      setFormData({
        nombre: usuarioActual.nombre || '', 
        telefono: usuarioActual.telefono || '',
        direccion: usuarioActual.direccion || ''
      });
      cargarMisPedidos();
    }
  }, [usuarioActual]);

  const cargarMisPedidos = async () => {
    if (!usuarioActual) return;
    try {
      const todos = await getAllPedidos();
      const nombreActual = usuarioActual.nombre || '';
      
      const filtrados = todos.filter(p => 
          (p.clienteNombre && p.clienteNombre === nombreActual) || 
          (p.clienteEmail === usuarioActual.username)
      );
      // El reverse() asegura que el último pedido (ID más alto) quede primero (índice 0)
      setMisPedidos(filtrados.reverse());
    } catch (error) {
      console.error("Error cargando pedidos", error);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarDatos = (e: React.FormEvent) => {
    e.preventDefault();
    const exito = actualizarDatosUsuario(formData);
    if (exito) {
      addNotification('Datos actualizados correctamente', 'success');
      setModoEdicion(false);
    } else {
      addNotification('Error al actualizar perfil', 'danger');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-secondary';
      case 'Procesando': return 'bg-primary';
      case 'Enviado': return 'bg-warning text-dark';
      case 'Entregado': return 'bg-success';
      case 'Cancelado': return 'bg-danger';
      default: return 'bg-light text-dark';
    }
  };

  if (!usuarioActual) return <Navigate to="/login" replace />;

  const nombreMostrar = usuarioActual.nombre || 'Usuario';
  const inicial = nombreMostrar.charAt(0).toUpperCase();
  const primerNombre = nombreMostrar.split(' ')[0];

  return (
    <div className="container py-5" style={{position: 'relative', zIndex: 10}}>
      {/* CABECERA SIMPLIFICADA (Sin botones redundantes) */}
      <div className="row mb-5 align-items-center">
        <div className="col-12 text-white text-shadow"> {/* Texto blanco con sombra para que se lea sobre la fruta */}
          <h1 className="display-4 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            Hola, {primerNombre}
          </h1>
          <p className="lead" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            Bienvenido a tu panel personal
          </p>
        </div>
      </div>

      <div className="row g-5">
        
        {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
        <div className="col-lg-4">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center">
              <div className="rounded-circle bg-white text-dark d-inline-flex align-items-center justify-content-center mb-3 fw-bold fs-2" 
                   style={{width: '80px', height: '80px'}}>
                  {inicial}
              </div>
              <h5 className="mb-0">{nombreMostrar}</h5>
              <small className="opacity-75">{usuarioActual.correo || usuarioActual.username}</small>
            </div>
            
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-uppercase text-muted small mb-0">Información Personal</h6>
                {!modoEdicion && (
                  <button onClick={() => setModoEdicion(true)} className="btn btn-sm btn-link text-decoration-none">
                    Editar
                  </button>
                )}
              </div>

              <form onSubmit={handleGuardarDatos}>
                <div className="mb-3">
                  <label className="form-label small text-muted">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${!modoEdicion ? 'form-control-plaintext ps-0 fw-bold' : ''}`}
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!modoEdicion}
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    name="telefono"
                    className={`form-control ${!modoEdicion ? 'form-control-plaintext ps-0 fw-bold' : ''}`}
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={!modoEdicion}
                    placeholder={modoEdicion ? "+56 9 ..." : "Sin registrar"}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Dirección de Envío</label>
                  <input
                    type="text"
                    name="direccion"
                    className={`form-control ${!modoEdicion ? 'form-control-plaintext ps-0 fw-bold' : ''}`}
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={!modoEdicion}
                    placeholder={modoEdicion ? "Calle Principal #123..." : "Sin registrar"}
                  />
                </div>

                {modoEdicion && (
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    <button type="button" onClick={() => setModoEdicion(false)} className="btn btn-light text-muted">Cancelar</button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL DE PEDIDOS */}
        <div className="col-lg-8">
            {/* Título con fondo blanco semitransparente para legibilidad */}
          <div className="bg-white p-3 rounded-4 shadow-sm mb-4 d-inline-block">
             <h4 className="mb-0 text-dark" style={{ fontFamily: "'Playfair Display', serif" }}>Historial de Pedidos</h4>
          </div>
          
          {cargando ? (
             <div className="text-center py-5 card rounded-4"><div className="spinner-border text-primary mx-auto my-3"></div></div>
          ) : misPedidos.length === 0 ? (
            <div className="card shadow-sm border-0 p-5 text-center bg-white rounded-4">
              <h2 className="display-1 text-muted mb-3">🛍️</h2>
              <h5>Aún no tienes pedidos</h5>
              <p className="text-muted mb-4">¡Explora nuestra tienda y disfruta de frutas frescas!</p>
              <div>
                <Link to="/catalogo" className="btn btn-primary px-4 rounded-pill">Ir al Catálogo</Link>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {misPedidos.map((pedido, index) => (
                <div key={pedido.id} className={`card border-0 shadow-sm rounded-4 overflow-hidden ${index === 0 ? 'border border-2 border-primary' : ''}`}>
                  <div className={`card-header py-3 d-flex justify-content-between align-items-center ${index === 0 ? 'bg-primary text-white' : 'bg-white'}`}>
                     <div>
                        <span className="fw-bold me-2">Pedido #{pedido.id}</span>
                        <span className={`small ${index === 0 ? 'text-white-50' : 'text-muted'}`}>
                            {pedido.fecha} a las {pedido.hora}
                        </span>
                        {/* ETIQUETA PARA EL ÚLTIMO PEDIDO */}
                        {index === 0 && <span className="badge bg-white text-primary ms-2">⭐ Más Reciente</span>}
                     </div>
                     <span className={`badge ${getBadgeColor(pedido.estado)} px-3 py-2 rounded-pill border border-light`}>
                       {pedido.estado}
                     </span>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive mb-3">
                      <table className="table table-sm table-borderless mb-0">
                        <thead className="text-muted border-bottom">
                          <tr>
                            <th>Producto</th>
                            <th className="text-center">Cant.</th>
                            <th className="text-end">Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.productos.map((prod, idx) => (
                            <tr key={`${pedido.id}-${idx}`}>
                              <td>{prod.nombre}</td>
                              <td className="text-center">x{prod.cantidad}</td>
                              <td className="text-end text-muted">${(prod.precio * prod.cantidad).toLocaleString('es-CL')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                       <small className="text-muted">Total pagado</small>
                       <h5 className="mb-0 fw-bold text-success">${pedido.total.toLocaleString('es-CL')}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}