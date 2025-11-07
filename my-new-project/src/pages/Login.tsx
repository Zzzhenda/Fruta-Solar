// src/pages/Login.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado específico para errores

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    const exito = login(correo, password);
    if (exito) {
      navigate('/perfil'); // Redirección inmediata si es exitoso
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  };

  return (
    <main className="container my-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: "450px" }}>
        <div className="card-body p-5">
          <h1 className="text-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Bienvenido</h1>

          {/* Alerta de Error */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input
                type="email"
                className={`form-control ${error ? 'is-invalid' : ''}`} // Feedback visual en el input
                id="correo"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success btn-lg">Ingresar</button>
            </div>
          </form>

          <hr className="my-4" />
          <p className="text-center m-0">
            ¿Nuevo en Fruto Solar? <Link to="/registro" className="text-success fw-bold text-decoration-none">Crea tu cuenta</Link>
          </p>
        </div>
      </div>
    </main>
  );
}