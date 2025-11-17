// src/pages/Home.tsx

import { Link } from 'react-router-dom';

export function Home() {
  return (
    <> {/* Usamos un Fragmento <>...</> porque React exige un solo elemento padre */}

      {/* Esta es la sección <main> de tu index.html original */}
      <section className="position-relative">
        <img src="/images/hero_frutillas.jpg" className="img-fluid w-100" alt="Frutas frescas" style={{ height: "650px", objectFit: "cover" }} />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white p-3" style={{ background: "rgba(0,0,0,0.35)", borderRadius: "10px" }}>
          <h1 className="display-3 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Luz. Fruta. Vida.</h1>
          <p className="fs-4">Descubre productos frescos y naturales en Fruto Solar</p>
          
          {/* ¡IMPORTANTE! Cambiamos <a> por <Link> */}
          <Link to="/catalogo" className="btn btn-warning btn-lg mt-3">Ver Catálogo</Link>
        </div>
      </section>

      <section className="container my-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="/images/calidad.jpg" className="card-img-top" alt="Calidad" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Calidad Superior</h5>
                <p className="card-text">Productos frescos y naturales, cultivados con amor y dedicación.</p>
                <Link to="/catalogo" className="btn btn-success mt-auto">Ver productos</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="https://tse2.mm.bing.net/th/id/OIP.O50SDh0pQhpCgPholFIIDAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3" className="card-img-top" alt="Sostenibilidad" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Sostenibilidad</h5>
                <p className="card-text">Comprometidos con prácticas agrícolas responsables y el cuidado del medio ambiente.</p>
                <Link to="/impacto" className="btn btn-success mt-auto">Ver impacto</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100   border-0 shadow-sm">
              <img src="/images/sostenibilidad.png" className="card-img-top" alt="Comunidad" height="300" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Apoyo a la Comunidad</h5>
                <p className="card-text">Trabajamos con agricultores locales para fortalecer la economía regional.</p>
                {/* Asumí que este botón iría a contacto, puedes cambiar "to" si quieres */}
                <Link to="/contacto" className="btn btn-success mt-auto">Saber más</Link> 
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}