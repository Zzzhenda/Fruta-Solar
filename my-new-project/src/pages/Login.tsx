// src/pages/Login.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => { // <--- ASYNC
    e.preventDefault();
    setError('');
    
    // LOGIN REAL
    const exito = await login(correo, password); // <--- AWAIT
    
    if (exito) {
      navigate('/perfil');
    } else {
      setError('Credenciales incorrectas o error de servidor.');
    }
  };

  return (
    <main className="container my-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: "450px" }}>
        <div className="card-body p-5">
          <h1 className="text-center mb-4">Bienvenido</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input type="text" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success btn-lg">Ingresar</button>
            </div>
          </form>
          <hr className="my-4" />
          <p className="text-center m-0">
            ¿Nuevo? <Link to="/registro" className="text-success fw-bold text-decoration-none">Crea tu cuenta</Link>
          </p>
        </div>
      </div>
    </main>
  );
}