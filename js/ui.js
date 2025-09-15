// ui.js

function updateNavbar() {
    const tienda = getDatosTienda();
    const navAuth = document.getElementById('nav-auth');

    if (!navAuth) {
        console.error('El elemento con ID "nav-auth" no se encontró en el DOM.');
        return;
    }

    const usuario = tienda.usuarios.find(u => u.correo === tienda.usuarioActual);
    
    // Si hay un usuario logueado
    if (usuario) {
        let navHtml = `
            <li class="nav-item me-3"><a class="nav-link btn btn-success text-white" href="carrito.html">Carrito</a></li>
            <li class="nav-item me-3"><a class="nav-link btn btn-success text-white" href="perfil.html">Mi Perfil</a></li>
        `;
        
        //  Verifica si el usuario es un administrador para mostrar el botón de panel
        if (usuario.rol === 'administrador') {
            navHtml += `<li class="nav-item me-3"><a class="nav-link btn btn-warning text-white" href="admin.html">Panel de Admin</a></li>`;
        }
        
        navHtml += `<li class="nav-item"><button class="nav-link btn btn-danger text-white" onclick="logout()">Cerrar Sesión</button></li>`;
        navAuth.innerHTML = navHtml;

    } else {
        // Si no hay un usuario logueado
        navAuth.innerHTML = `
            <li class="nav-item me-3"><a class="nav-link btn btn-success text-white" href="carrito.html">Carrito</a></li>
            <li class="nav-item me-3"><a class="nav-link btn btn-success text-white" href="login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link btn btn-success text-white" href="registro.html">Registro</a></li>
        `;
    }
}

function logout() {
    const tienda = getDatosTienda();
    tienda.usuarioActual = null;
    localStorage.setItem('miTienda', JSON.stringify(tienda));
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', updateNavbar);