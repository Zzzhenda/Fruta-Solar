import { useMemo, useState, useEffect } from 'react'; // Agregamos useState y useEffect
import { useAuth, type Pedido, type Usuario } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { Navigate, Link } from 'react-router-dom';

export function AdminReportes() {
  const { usuarioActual, getAllPedidos, getAllUsuarios } = useAuth();
  // Eliminamos useProducts si no se usa directamente, aunque lo dejé por si acaso.
  const { productos } = useProducts(); 

  // --- ESTADO LOCAL PARA DATOS ASÍNCRONOS ---
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  // Protección de ruta
  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  // --- CARGA DE DATOS (EFECTO) ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Usamos Promise.all para cargar ambos en paralelo (más rápido)
        const [pedidosData, usuariosData] = await Promise.all([
          getAllPedidos(),
          getAllUsuarios()
        ]);
        
        setPedidos(pedidosData);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []); // Se ejecuta solo al montar el componente

  // --- CÁLCULOS DE BI (AHORA USAN EL ESTADO) ---
  
  const kpis = useMemo(() => {
    // Ya no llamamos a getAllPedidos(), usamos la variable de estado 'pedidos'
    
    // Filtramos solo pedidos válidos (no cancelados) para los ingresos
    const pedidosValidos = pedidos.filter(p => p.estado !== 'Cancelado');
    const ingresosTotales = pedidosValidos.reduce((sum, p) => sum + p.total, 0);
    
    // Ticket promedio
    const ticketPromedio = pedidosValidos.length > 0 ? Math.round(ingresosTotales / pedidosValidos.length) : 0;

    return {
      ingresos: ingresosTotales,
      totalPedidos: pedidos.length,
      pedidosCompletados: pedidos.filter(p => p.estado === 'Entregado').length,
      totalClientes: usuarios.filter(u => u.rol === 'cliente').length,
      ticketPromedio
    };
  }, [pedidos, usuarios]); // Dependencias: estado local

  const ventasPorProducto = useMemo(() => {
    const contador: Record<string, { nombre: string; cantidad: number; ingresos: number }> = {};

    pedidos.forEach(pedido => {
      if (pedido.estado !== 'Cancelado') { 
        pedido.productos.forEach(prod => {
          // Aseguramos que prod.id sea string para la clave
          const idStr = String(prod.id);
          
          if (!contador[idStr]) {
            contador[idStr] = { nombre: prod.nombre, cantidad: 0, ingresos: 0 };
          }
          contador[idStr].cantidad += prod.cantidad;
          contador[idStr].ingresos += prod.precio * prod.cantidad;
        });
      }
    });

    return Object.values(contador).sort((a, b) => b.cantidad - a.cantidad);
  }, [pedidos]);

  const estadoPedidos = useMemo(() => {
    const total = pedidos.length;
    if (total === 0) return [];

    const counts = pedidos.reduce((acc, p) => {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([estado, count]) => ({
      estado,
      count,
      porcentaje: Math.round((count / total) * 100)
    }));
  }, [pedidos]);

  const getColorEstado = (estado: string) => {
    switch(estado) {
        case 'Pendiente': return 'secondary';
        case 'Procesando': return 'primary';
        case 'Enviado': return 'warning';
        case 'Entregado': return 'success';
        case 'Cancelado': return 'danger';
        default: return 'info';
    }
  };

  if (cargando) {
      return <div className="p-5 text-center"><h3>Cargando Reportes...</h3></div>;
  }

  return (
    <main className="container-fluid px-4 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Reportes y Métricas</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left"></i> Volver al Panel
        </Link>
      </div>

      {/* SECCIÓN 1: KPIs */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-xl-3">
          <div className="card bg-success text-white h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase mb-2 opacity-75">Ingresos Totales</h6>
              <h2 className="display-6 fw-bold mb-0">${kpis.ingresos.toLocaleString('es-CL')}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card bg-primary text-white h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase mb-2 opacity-75">Total Pedidos</h6>
              <div className="d-flex align-items-end justify-content-between">
                  <h2 className="display-6 fw-bold mb-0">{kpis.totalPedidos}</h2>
                  <span className="badge bg-white text-primary mb-2">
                    {kpis.pedidosCompletados} entregados
                  </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
           <div className="card bg-info text-white h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase mb-2 opacity-75">Clientes Registrados</h6>
              <h2 className="display-6 fw-bold mb-0">{kpis.totalClientes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
           <div className="card bg-secondary text-white h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase mb-2 opacity-75">Ticket Promedio</h6>
              <h2 className="display-6 fw-bold mb-0">${kpis.ticketPromedio.toLocaleString('es-CL')}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* SECCIÓN 2: ESTADO DE PEDIDOS */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-header bg-transparent py-3">
              <h5 className="mb-0 fw-bold">Estado de los Pedidos</h5>
            </div>
            <div className="card-body">
              {kpis.totalPedidos === 0 ? (
                <p className="text-muted text-center py-5">No hay datos suficientes aún.</p>
              ) : (
                estadoPedidos.map(({ estado, count, porcentaje }) => (
                    <div key={estado} className="mb-4">
                        <div className="d-flex justify-content-between mb-1">
                            <span className="fw-medium">{estado}</span>
                            <span className="text-muted small">{count} pedidos ({porcentaje}%)</span>
                        </div>
                        <div className="progress" style={{height: '10px'}}>
                            <div 
                                className={`progress-bar bg-${getColorEstado(estado)}`} 
                                role="progressbar" 
                                style={{width: `${porcentaje}%`}}
                                aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}
                            ></div>
                        </div>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: TOP PRODUCTOS VENDIDOS */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-header bg-transparent py-3">
              <h5 className="mb-0 fw-bold">Top Productos Vendidos</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Producto</th>
                      <th className="text-center">U. Vendidas</th>
                      <th className="text-end pe-4">Ingresos Generados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasPorProducto.slice(0, 5).map((item, index) => (
                      <tr key={item.nombre}>
                        <td className="ps-4 text-muted">{index + 1}</td>
                        <td className="fw-medium">{item.nombre}</td>
                        <td className="text-center">
                            <span className="badge bg-light text-dark border px-3">
                                {item.cantidad}
                            </span>
                        </td>
                        <td className="text-end pe-4 fw-bold text-success">
                            ${item.ingresos.toLocaleString('es-CL')}
                        </td>
                      </tr>
                    ))}
                    {ventasPorProducto.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4 text-muted">Sin ventas registradas</td></tr>
                    )}
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