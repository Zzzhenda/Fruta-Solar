// utils.js

// Obtiene los datos de la tienda desde localStorage, inicializa si no existe
function getDatosTienda() {
    let tienda = JSON.parse(localStorage.getItem('miTienda'));

    if (!tienda) {
        const adminUser = {
            correo: 'admin@frutosolar.cl',
            password: 'admin123', // unificado
            nombre: 'Administrador',
            rol: 'administrador',
            carrito: [],
            pedidos: []
        };
        tienda = { usuarioActual: null, usuarios: [adminUser] };
        localStorage.setItem('miTienda', JSON.stringify(tienda));
        console.log("Tienda inicializada con usuario administrador por defecto.");
    }

    return tienda;
}

// Guarda los datos de la tienda en localStorage
function setDatosTienda(tienda) {
    localStorage.setItem('miTienda', JSON.stringify(tienda));
}

// Obtiene el usuario actualmente logueado, o null si no hay
function getUsuarioActual() {
    const tienda = getDatosTienda();
    return tienda.usuarios.find(u => u.correo === tienda.usuarioActual) || null;
}

// Función para redirigir si no hay usuario logueado
function requireLogin(redirectPage = "login.html") {
    const usuario = getUsuarioActual();
    if (!usuario) window.location.href = redirectPage;
    return usuario;
}

// Función para cerrar sesión
function logout() {
    const tienda = getDatosTienda();
    tienda.usuarioActual = null;
    setDatosTienda(tienda);
    window.location.href = "index.html";
}

// Función para inicializar productos en localStorage si no existen
function initProductos(defaultProductos) {
    if (!localStorage.getItem('productos')) {
        localStorage.setItem('productos', JSON.stringify(defaultProductos));
    }
}
