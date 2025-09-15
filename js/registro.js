//registro.js

document.getElementById('formRegistro').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim().toLowerCase();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const mensaje = document.getElementById('mensaje');

    if (password !== password2) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.style.color = "red";
        return;
    }

    const miTienda = JSON.parse(localStorage.getItem('miTienda')) || { usuarios: [], usuarioActual: null };

    if (miTienda.usuarios.some(u => u.correo === correo)) {
        mensaje.textContent = "El correo ya está registrado.";
        mensaje.style.color = "red";
        return;
    }

    const nuevoUsuario = {
        nombre,
        correo,
        telefono,
        direccion,
        password,  
        rol: "cliente",
        carrito: [],
        pedidos: []
    };

    miTienda.usuarios.push(nuevoUsuario);
    localStorage.setItem('miTienda', JSON.stringify(miTienda));

    mensaje.textContent = "¡Registro exitoso! Ahora puedes iniciar sesión.";
    mensaje.style.color = "green";
    document.getElementById('formRegistro').reset();
});
