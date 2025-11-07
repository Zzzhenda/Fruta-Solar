// src/pages/Registro.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    password2: ''
  });
  const [alerta, setAlerta] = useState<{ tipo: 'success' | 'danger' | '', mensaje: string }>({ tipo: '', mensaje: '' });

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
      setAlerta({ tipo: 'danger', mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (formData.password !== formData.password2) {
      setAlerta({ tipo: 'danger', mensaje: 'Las contraseñas no coinciden.' });
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
      setAlerta({ tipo: 'success', mensaje: '¡Registro exitoso! Redirigiendo al login...' });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setAlerta({ tipo: 'danger', mensaje: 'El correo ya está registrado.' });
    }
  };

  return (
    <main className="container my-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body p-5">
          <h1 className="text-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Crear Cuenta</h1>

          {/* Feedback Visual Inmediato */}
          {alerta.mensaje && (
            <div className={`alert alert-${alerta.tipo}`} role="alert">
              {alerta.mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre completo <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="nombre" required
                     value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo electrónico <span className="text-danger">*</span></label>
              <input type="email" className="form-control" id="correo" required
                     value={formData.correo} onChange={handleChange} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono</label>
                <input type="tel" className="form-control" id="telefono" placeholder="+569..."
                       value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                 <label className="form-label">Dirección</label>
                 <input type="text" className="form-control" id="direccion"
                        value={formData.direccion} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña <span className="text-danger">*</span></label>
              <input type="password" className="form-control" id="password" required minLength={6}
                     value={formData.password} onChange={handleChange} />
              <div className="form-text">Mínimo 6 caracteres.</div>
            </div>
            <div className="mb-4">
              <label className="form-label">Confirmar contraseña <span className="text-danger">*</span></label>
              <input type="password" className="form-control" id="password2" required
                     value={formData.password2} onChange={handleChange} />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success btn-lg">Registrarse</button>
            </div>
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