// src/pages/Registro.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    password2: ''
  });
  
  const { addNotification } = useNotification();
  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validaciones explícitas
    if (formData.password.length < 6) {
      addNotification('La contraseña debe tener al menos 6 caracteres.', 'warning');
      return;
    }
    if (formData.password !== formData.password2) {
      addNotification('Las contraseñas no coinciden.', 'danger');
      return;
    }

    // 2. Intento de registro
    const exito = registro({
      nombre: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono,
      direccion: formData.direccion,
      password: formData.password
    });

    if (exito) {
      addNotification('¡Registro exitoso! Redirigiendo al login...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      addNotification('El correo ya está registrado.', 'danger');
    }
  };

  return (
    <main className="container my-5">
      {/* Esta es la tarjeta blanca que sí estás viendo */}
      <div className="card shadow-lg mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body p-5">
          <h1 className="text-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Crear Cuenta</h1>

          <form onSubmit={handleSubmit}>
            {/* --- ESTO ES LO QUE TE FALTABA --- */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="nombre" required
                     value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico <span className="text-danger">*</span></label>
              <input type="email" className="form-control" id="correo" required
                     value={formData.correo} onChange={handleChange} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input type="tel" className="form-control" id="telefono" placeholder="+569..."
                       value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input type="text" className="form-control" id="direccion"
                       value={formData.direccion} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña <span className="text-danger">*</span></label>
              <input type="password" className="form-control" id="password" required minLength={6}
                     value={formData.password} onChange={handleChange} />
              <div className="form-text">Mínimo 6 caracteres.</div>
            </div>
            <div className="mb-4">
              <label htmlFor="password2" className="form-label">Confirmar contraseña <span className="text-danger">*</span></label>
              <input type="password" className="form-control" id="password2" required
                     value={formData.password2} onChange={handleChange} />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success btn-lg">Registrarse</button>
            </div>
            {/* --- FIN DE LA SECCIÓN FALTANTE --- */}
          </form>
          <hr className="my-4" />
          <p className="text-center m-0">
            ¿Ya tienes cuenta? <Link to="/login" className="text-success fw-bold text-decoration-none">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
}