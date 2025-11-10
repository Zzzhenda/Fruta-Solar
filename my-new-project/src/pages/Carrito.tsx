// src/pages/Carrito.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export function Carrito() {
  const { carrito, totalCarrito, actualizarCantidad, quitarDelCarrito, finalizarCompra } = useCart();
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleCheckout = () => {
    if (!usuarioActual) {
      addNotification("Debes iniciar sesión para finalizar la compra.", 'info');
      navigate('/login');
      return;
    }
    if (carrito.length === 0) {
      addNotification("El carrito está vacío.", 'warning');
      return;
    }

    const exito = finalizarCompra();

    if (exito) {
      addNotification("¡Compra realizada con éxito! Revisa tu perfil.", 'success');
      navigate('/perfil');
    } else {
      // Notificación de error de stock ya la da el CartContext
    }
  };

  if (carrito.length === 0) {
    return (
      // --- ¡ARREGLO AQUÍ! ---
      // Añadimos la clase 'seccion-catalogo' (de tu style.css) para el fondo oscuro
      <div className="container my-5">
        <div className="text-center seccion-catalogo" style={{maxWidth: '600px', margin: 'auto'}}>
          <h2 className="my-4" style={{color: '#fff'}}>Tu carrito está vacío</h2>
          <p className="mb-4">¿Por qué no agregas algunas frutas frescas?</p>
          <Link to="/catalogo" className="btn btn-success btn-lg">Ir al Catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container my-5">
      {/* El h1 aquí usará la regla H1 de tu CSS (verde, sombra) */}
      <h1 className="text-center mb-4">Mi Carrito</h1>
      
      <div className="row">
        <div className="col-lg-9">
          {/* Esta tarjeta es blanca por defecto, lo cual está bien para la tabla */}
          <div className="table-responsive card shadow-sm border-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-success">
                <tr>
                  <th scope="col" className="py-3">Producto</th>
                  <th scope="col" className="py-3">Precio</th>
                  <th scope="col" className="py-3">Cantidad</th>
                  <th scope="col" className="py-3">Subtotal</th>
                  <th scope="col" className="py-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={item.imagen} alt={item.nombre} width="60" height="60" className="me-3 rounded-3" style={{objectFit: 'cover'}}/>
                        <span className="fw-medium">{item.nombre}</span>
                      </div>
                    </td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                        <button className="btn btn-outline-secondary" onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} type="button">-</button>
                        <input type="text" className="form-control text-center bg-white" value={item.cantidad} readOnly />
                        <button className="btn btn-outline-secondary" onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} type="button">+</button>
                      </div>
                    </td>
                    <td className="fw-medium">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm" onClick={() => quitarDelCarrito(item.id)} title="Eliminar producto">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-3 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-success text-white py-3">
              <h5 className="mb-0">Resumen del Pedido</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span>${totalCarrito.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Envío:</span>
                <span className="text-success">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Total:</span>
                <span>${totalCarrito.toLocaleString('es-CL')}</span>
              </div>
              <button className="btn btn-success w-100 btn-lg" onClick={handleCheckout}>
                Finalizar Compra
              </button>
              <Link to="/catalogo" className="btn btn-outline-secondary w-100 mt-2">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}