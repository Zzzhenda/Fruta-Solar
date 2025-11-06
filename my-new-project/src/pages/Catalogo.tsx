// src/pages/Catalogo.tsx
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export function Catalogo() {
  // 1. Obtiene los productos y la función del carrito desde los contextos
  const { productos } = useProducts();
  const { agregarAlCarrito } = useCart();
  
  // (En el futuro, aquí agregarías los filtros de tu js/catalogo.js)

  return (
    <div className="container my-5">
      <h1 className="display-4 text-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Nuestro Catálogo
      </h1>
      <p className="text-center fs-5 mb-5">Productos frescos, directo del campo a tu hogar.</p>

      {/* 2. El .map() ahora usa los productos del contexto */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productos.map((producto) => (
          <div className="col" key={producto.id}>
            <div className="card h-100 shadow-sm border-0">
              <img src={producto.imagen} className="card-img-top" alt={producto.nombre} style={{ height: '300px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text fs-5 text-success">${producto.precio.toLocaleString('es-CL')} CLP</p>
                <p className="card-text small">{producto.descripcion}</p>
                <p className={`card-text small ${producto.stock > 0 ? 'text-muted' : 'text-danger fw-bold'}`}>
                  Stock: {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                </p>
                
                {/* 3. Llama a la función del contexto al hacer clic */}
                <button 
                  className="btn btn-warning mt-auto"
                  onClick={() => agregarAlCarrito(producto)}
                  disabled={producto.stock <= 0} // Deshabilita el botón si no hay stock
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