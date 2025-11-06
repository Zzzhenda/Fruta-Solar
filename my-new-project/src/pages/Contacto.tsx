export function Contacto() {
  const sucursales = [
    { ciudad: "Santiago", mapa: "https://maps.google.com/?cid=9544769440031115569&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
    { ciudad: "Puerto Montt", mapa: "https://maps.google.com/?cid=9701863393176439263&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
    { ciudad: "Villarrica", mapa: "https://maps.google.com/?cid=16681666192094556108&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
    { ciudad: "Nacimiento", mapa: "https://maps.google.com/?cid=2839071061813099008&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
    { ciudad: "Viña del Mar", mapa: "https://maps.google.com/?cid=10259163078306119999&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
    { ciudad: "Valparaíso", mapa: "https://maps.google.com/?cid=16936413724869237622&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
    { ciudad: "Concepción", mapa: "https://maps.google.com/?cid=4957117075347809944&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" },
  ];

  return (
    <main className="container my-5">
      <h1 className="text-center mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Contacto</h1>
      
      <div className="row text-center mb-5 g-4">
        <div className="col-md-6">
          <div className="card p-4 h-100 shadow-sm bg-dark text-white border-success">
            <div className="card-body">
              <h3 className="card-title text-success mb-3">📍 Ubicación Principal</h3>
              <p className="card-text fs-5">
                Talcahuano, Chile
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 h-100 shadow-sm bg-dark text-white border-success">
             <div className="card-body">
              <h3 className="card-title text-success mb-3">📞 Canales de Atención</h3>
              <p className="card-text fs-5">
                +56 9 1234 5678<br/>
                contacto@frutosolar.cl
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      <section className="text-center">
        <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Nuestra Presencia</h2>
        <p className="lead mb-5">
          Estamos expandiendo nuestra red para estar más cerca de ti.
        </p>
        <div className="row justify-content-center">
          {sucursales.map((sucursal, index) => (
            <div className="col-md-4 col-lg-3 mb-4" key={index}>
              <div className="card p-3 h-100 shadow-sm hover-effect">
                <h4 className="card-title text-success">{sucursal.ciudad}</h4>
                <a href={sucursal.mapa} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm mt-2">
                  Ver en el mapa
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}