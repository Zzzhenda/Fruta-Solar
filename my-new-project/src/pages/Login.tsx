import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  const { login } = useAuth(); // 1. Obtiene la función login del contexto
  const navigate = useNavigate(); // 2. Hook para redirigir

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Llama a la función del contexto
    const exito = login(correo, password); 
    
    if (exito) {
      setMensaje('¡Bienvenido! Redirigiendo...');
      // 4. Redirige al perfil si el login es exitoso
      setTimeout(() => navigate('/perfil'), 1000); 
    } else {
      setMensaje('Correo o contraseña incorrectos.');
    }
  };

  return (
    <main className="container my-5">
      {/* Usamos las clases de tu CSS original */}
      <div className="form-container mx-auto" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4">Iniciar sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              id="correo" 
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Ingresar</button>
        </form>
        {mensaje && <p className="text-center mt-3">{mensaje}</p>}
        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}