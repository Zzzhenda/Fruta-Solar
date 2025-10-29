// src/pages/Registro.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Registro() {
    // 1. Estados para cada input del formulario
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    
    // Estado para mensajes de error o éxito
    const [mensaje, setMensaje] = useState('');

    // 2. Función que maneja el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue

        // 3. Lógica de validación (reemplaza tu registro.js)
        if (password !== password2) {
            setMensaje('Las contraseñas no coinciden');
            return;
        }

        // Aquí iría la lógica para guardar el usuario (localStorage, API, etc.)
        // Por ahora, solo mostramos los datos en la consola
        console.log("Datos del nuevo usuario:", {
            nombre,
            correo,
            telefono,
            direccion,
            password
        });
        
        setMensaje('¡Registro exitoso! (Revisa la consola)');
        // Aquí podrías limpiar el formulario si quisieras
    };

    // 4. El HTML de tu registro.html, adaptado a JSX
    return (
        <main className="container my-5 registro-content">
            {/* Usamos la clase 'form-container' de tu CSS */}
            <div className="form-container mx-auto" style={{ maxWidth: "500px" }}>
                <h1 className="text-center mb-4">Crear cuenta</h1>
                
                {/* Cambiamos <form id="formRegistro"> por <form onSubmit={...}>
                  Copiamos el form de Pages/registro.html
                */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        {/* 'for' se cambia por 'htmlFor' */}
                        <label htmlFor="nombre" className="form-label">Nombre completo</label>
                        {/* 'class' se cambia por 'className' */}
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre" 
                            placeholder="Ej: Humberto Suazo" 
                            required 
                            value={nombre} // 5. Conecta el valor al estado
                            onChange={(e) => setNombre(e.target.value)} // 6. Conecta el cambio al estado
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
                
                {/* Mostramos el mensaje de estado */}
                {mensaje && <p className="text-center mt-3">{mensaje}</p>}
                
                <p className="text-center mt-3">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </main>
    );
}