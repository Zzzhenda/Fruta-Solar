// src/pages/Catalogo.tsx
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export function Catalogo() {
  const { productos } = useProducts();
  const { agregarAlCarrito } = useCart();
  
  return (
    <div className="container my-5">
      {/* Este h1 usa la clase .catalogo-title de tu CSS, lo cual es correcto */}
      <h1 className="catalogo-title display-4 text-center mb-4">
        Nuestro Catálogo
      </h1>
      <p className="text-center fs-5 mb-5 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
        Productos frescos, directo del campo a tu hogar.
      </p>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productos.map((producto) => (
          <div className="col" key={producto.id}>
            <div className="card h-100 shadow-sm border-0">
              <img src={producto.imagen} className="card-img-top" alt={producto.nombre} style={{ height: '300px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                
                {/* --- ¡ARREGLO AQUÍ! --- */}
                {/* Cambiamos 'text-success' por 'text-dark fw-bold' para legibilidad */}
                <p className="card-text fs-5 text-dark fw-bold">${producto.precio.toLocaleString('es-CL')} CLP</p>
                
                <p className="card-text small">{producto.descripcion}</p>
                <p className={`card-text small ${producto.stock > 0 ? 'text-muted' : 'text-danger fw-bold'}`}>
                  Stock: {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                </p>
                
                <button 
                  className="btn btn-warning mt-auto"
                  onClick={() => agregarAlCarrito(producto)}
                  disabled={producto.stock <= 0}
                >
                  {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}