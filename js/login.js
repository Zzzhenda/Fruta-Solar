//login.js

document.getElementById('formLogin').addEventListener('submit', function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensaje');

    const miTienda = getDatosTienda();

    // Buscar usuario por correo y password
    const usuario = miTienda.usuarios.find(u => u.correo === correo && u.password === password);

    if (!usuario) {
        mensaje.textContent = "Correo o contraseña incorrectos.";
        mensaje.style.color = "red";
        return;
    }

    // Combinar carrito de invitado si existe
    const carritoInvitado = JSON.parse(localStorage.getItem('carritoInvitado')) || [];
    if (carritoInvitado.length > 0) {
        if (!usuario.carrito) usuario.carrito = [];

        carritoInvitado.forEach(item => {
            const existente = usuario.carrito.find(p => p.id === item.id);
            if (existente) existente.cantidad += item.cantidad;
            else usuario.carrito.push(item);
        });

        localStorage.removeItem('carritoInvitado');
    }

    // Guardar usuario logueado
    miTienda.usuarioActual = usuario.correo;
    localStorage.setItem('miTienda', JSON.stringify(miTienda));

    mensaje.textContent = `¡Bienvenido, ${usuario.nombre}!`;
    mensaje.style.color = "green";

    setTimeout(() => window.location.href = "perfil.html", 1000);
});
