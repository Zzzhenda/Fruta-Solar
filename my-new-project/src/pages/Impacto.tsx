export function Impacto() {
  return (
    <main className="container my-5">
      <section className="text-center">
        <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", color: '#4CAF50', fontWeight: 700 }}>
          Nuestro Impacto Positivo
        </h2>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 mb-4">
            <div className="card p-4 h-100 shadow-sm border-0" style={{backgroundColor: 'rgba(24, 24, 24, 0.03)'}}>
              <div className="card-body">
                <h3 className="card-title text-success mb-3">🌱 Huella de Carbono Reducida</h3>
                <p className="card-text lead fs-6">
                  Al comprar productos directamente de agricultores locales, eliminamos los largos viajes y el almacenamiento en frío, reduciendo significativamente la huella de carbono de cada producto que llega a tu hogar.
                </p>
                <p className="text-muted mt-3 fw-medium">¡Cada compra es un paso hacia un planeta más verde!</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-5 mb-4">
            <div className="card p-4 h-100 shadow-sm border-0" style={{backgroundColor: 'rgba(24, 24, 24, 0.03)'}}>
              <div className="card-body">
                <h3 className="card-title text-success mb-3">🤝 Apoyo a las Comunidades Locales</h3>
                <p className="card-text lead fs-6">
                  Tu apoyo nos permite trabajar directamente con agricultores de la región, asegurando precios justos para su arduo trabajo. Con cada compra, fortaleces la economía local y contribuyes a la prosperidad de las familias que cultivan tus alimentos.
                </p>
                <p className="text-muted mt-3 fw-medium">Eres parte de un cambio positivo en nuestra comunidad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}