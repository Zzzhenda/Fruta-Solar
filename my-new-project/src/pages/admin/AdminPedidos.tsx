// src/pages/admin/AdminPedidos.tsx
import { useState, useEffect } from 'react';
import { useAuth, type Pedido } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

// Definimos un tipo extendido para incluir datos del cliente en la vista
type PedidoExtendido = Pedido & { clienteEmail: string; clienteNombre: string };

export function AdminPedidos() {
  const { usuarioActual, getAllPedidos, actualizarEstadoPedido } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoExtendido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Protección de ruta
  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  // Cargar pedidos al montar el componente
  useEffect(() => {
    refrescarPedidos();
  }, [getAllPedidos]); // Dependencia para recargar si cambia el contexto

  const refrescarPedidos = () => {
    setPedidos(getAllPedidos());
  };

  const handleCambioEstado = (pedidoId: number, nuevoEstado: string) => {
    actualizarEstadoPedido(pedidoId, nuevoEstado);
    refrescarPedidos(); // Recargamos la lista para ver el cambio
  };

  // Lógica de filtrado
  const pedidosFiltrados = filtroEstado === 'Todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtroEstado);

  // Función auxiliar para el color del badge según el estado
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

  return (
    <main className="container-fluid px-4 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Gestión de Pedidos</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left"></i> Volver al Panel
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex align-items-center py-2">
          <span className="me-3 fw-bold text-muted"><i className="bi bi-funnel"></i> Filtrar por estado:</span>
          <div className="btn-group">
            {['Todos', 'Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'].map(estado => (
              <button
                key={estado}
                className={`btn btn-sm ${filtroEstado === estado ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setFiltroEstado(estado)}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado Actual</th>
                  <th>Acciones (Cambiar Estado)</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map(pedido => (
                  // Usamos React.Fragment para poder tener filas expandibles en el futuro si quisieras
                  <tr key={pedido.id}>
                    <td className="fw-bold">#{pedido.id}</td>
                    <td>
                      {pedido.fecha}<br/>
                      <small className="text-muted">{pedido.hora}</small>
                    </td>
                    <td>
                      <div className="fw-medium">{pedido.clienteNombre}</div>
                      <small className="text-muted">{pedido.clienteEmail}</small>
                    </td>
                    <td className="fw-bold text-success">
                      ${pedido.total.toLocaleString('es-CL')}
                    </td>
                    <td>
                      <span className={`badge ${getBadgeColor(pedido.estado)} px-3 py-2 rounded-pill`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                         <button className="btn btn-sm btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
                           Gestionar
                         </button>
                         <ul className="dropdown-menu">
                           <li><h6 className="dropdown-header">Marcar como:</h6></li>
                           <li><button className="dropdown-item text-primary" onClick={() => handleCambioEstado(pedido.id, 'Procesando')}>Procesando</button></li>
                           <li><button className="dropdown-item text-warning" onClick={() => handleCambioEstado(pedido.id, 'Enviado')}>Enviado</button></li>
                           <li><button className="dropdown-item text-success" onClick={() => handleCambioEstado(pedido.id, 'Entregado')}>Entregado</button></li>
                           <li><hr className="dropdown-divider"/></li>
                           <li><button className="dropdown-item text-danger" onClick={() => handleCambioEstado(pedido.id, 'Cancelado')}>Cancelar Pedido</button></li>
                         </ul>
                      </div>
                      {/* Opcional: Botón para ver detalles completos */}
                      <button
                        className="btn btn-sm btn-link text-secondary ms-2"
                        onClick={() => alert(`Detalle rápido:\n${pedido.productos.map(p => `- ${p.cantidad}x ${p.nombre}`).join('\n')}`)}
                      >
                        <i className="bi bi-eye"></i> Ver items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pedidosFiltrados.length === 0 && (
            <div className="text-center py-5 text-muted">
              No se encontraron pedidos con el filtro seleccionado.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}