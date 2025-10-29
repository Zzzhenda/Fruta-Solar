// src/pages/Catalogo.tsx
import { Link } from 'react-router-dom';

// Más adelante, estos datos vendrán de una API (Paso 5 del informe)
// Por ahora, los copiamos de tu Caso.pdf
const productos = [
  { id: "FR001", nombre: "Manzanas Fuji", precio: 1200, img: "/images/manzana.png" },
  { id: "FR002", nombre: "Naranjas Valencia", precio: 1000, img: "/images/Naranja.png" },
  { id: "FR003", nombre: "Plátanos Cavendish", precio: 800, img: "/images/Platano.png" },
  { id: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, img: "/images/Carrotss-1.png" },
  { id: "VR002", nombre: "Espinacas Frescas", precio: 700, img: "/images/Espinaca.png" },
  { id: "PO001", nombre: "Miel Orgánica", precio: 5000, img: "/images/Miel.png" },
];

export function Catalogo() {
  return (
    <div className="container my-5">
      <h1 className="display-4 text-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Nuestro Catálogo
      </h1>
      <p className="text-center fs-5 mb-5">Productos frescos, directo del campo a tu hogar.</p>

      {/* Aquí reemplazamos el antiguo JS con un .map() de React */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productos.map((producto) => (
          <div className="col" key={producto.id}>
            <div className="card h-100 shadow-sm border-0">
              <img src={producto.img} className="card-img-top" alt={producto.nombre} style={{ height: '300px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text fs-5 text-success">${producto.precio.toLocaleString('es-CL')} CLP / kg</p>
                <button className="btn btn-warning mt-auto">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}