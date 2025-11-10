export function Impacto() {
  return (
    <main className="container my-5">
      {/* Esta sección ya tiene el fondo oscuro y el color de texto claro por defecto */}
      <section className="text-center seccion-impacto">
        <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", color: '#4CAF50', fontWeight: 700 }}>
          Nuestro Impacto Positivo
        </h2>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 mb-4">
            {/* Usamos la clase 'admin-pedidos' para que tu CSS aplique el fondo oscuro a la tarjeta */}
            <div className="admin-pedidos">
              <div className="card p-4 h-100 shadow-sm border-0">
                <div className="card-body">
                  <h3 className="card-title text-success mb-3">🌱 Huella de Carbono Reducida</h3>
                  
                  {/* --- ¡ARREGLO AQUÍ! --- */}
                  {/* Añadimos 'text-light' para que el párrafo sea legible */}
                  <p className="card-text lead fs-6 text-light">
                    Al comprar productos directamente de agricultores locales, eliminamos los largos viajes y el almacenamiento en frío, reduciendo significativamente la huella de carbono de cada producto que llega a tu hogar.
                  </p>
                  
                  {/* --- ¡ARREGLO AQUÍ! --- */}
                  {/* Reemplazamos 'text-muted' (oscuro) por 'text-white-50' (claro) */}
                  <p className="text-white-50 mt-3 fw-medium">¡Cada compra es un paso hacia un planeta más verde!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-5 mb-4">
            {/* Usamos la clase 'admin-pedidos' para que tu CSS aplique el fondo oscuro a la tarjeta */}
            <div className="admin-pedidos">
              <div className="card p-4 h-100 shadow-sm border-0">
                <div className="card-body">
                  <h3 className="card-title text-success mb-3">🤝 Apoyo a las Comunidades Locales</h3>
                  
                  {/* --- ¡ARREGLO AQUÍ! --- */}
                  <p className="card-text lead fs-6 text-light">
                    Tu apoyo nos permite trabajar directamente con agricultores de la región, asegurando precios justos para su arduo trabajo. Con cada compra, fortaleces la economía local y contribuyes a la prosperidad de las familias que cultivan tus alimentos.
                  </p>

                  {/* --- ¡ARREGLO AQUÍ! --- */}
                  <p className="text-white-50 mt-3 fw-medium">Eres parte de un cambio positivo en nuestra comunidad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}