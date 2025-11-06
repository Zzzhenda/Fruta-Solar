// src/pages/Registro.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importa el hook de Auth

export function Registro() {
  // Estados para cada input
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [mensaje, setMensaje] = useState('');

  const { registro } = useAuth(); // 2. Obtiene la función de registro
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 

    if (password !== password2) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    // 3. Llama a la función de registro del contexto
    const exito = registro({
      nombre,
      correo,
      telefono,
      direccion,
      password 
    });

    if (exito) {
      setMensaje('¡Registro exitoso! Serás redirigido al Login.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMensaje('El correo ya está registrado.');
    }
  };

  return (
    <main className="container my-5 registro-content">
      <div className="form-container mx-auto" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4">Crear cuenta</h1>
        
        {/* 4. Conecta el formulario a la función handleSubmit */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre completo</label>
            <input 
              type="text" 
              className="form-control" 
              id="nombre" 
              placeholder="Ej: Humberto Suazo" 
              required 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              id="correo" 
              placeholder="ejemplo@email.com" 
              required 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input 
              type="tel" 
              className="form-control" 
              id="telefono" 
              placeholder="+56 9 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input 
              type="text" 
              className="form-control" 
              id="direccion" 
              placeholder="Calle, número, ciudad"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
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
          <div className="mb-3">
            <label htmlFor="password2" className="form-label">Confirmar contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              id="password2" 
              required 
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Registrarse</button>
        </form>
        
        {mensaje && <p className="text-center mt-3">{mensaje}</p>}
        
        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}