// carrito.js

// Obtiene el carrito del usuario actual o invitado
function getCarrito() {
    const tienda = getDatosTienda();
    if (tienda.usuarioActual) {
        const usuario = tienda.usuarios.find(u => u.correo === tienda.usuarioActual);
        return usuario?.carrito || [];
    }
    return JSON.parse(localStorage.getItem("carritoInvitado")) || [];
}

// Guarda el carrito en el usuario actual o invitado
function setCarrito(carrito) {
    const tienda = getDatosTienda();
    if (tienda.usuarioActual) {
        const usuario = tienda.usuarios.find(u => u.correo === tienda.usuarioActual);
        if (usuario) {
            usuario.carrito = carrito;
            const idx = tienda.usuarios.findIndex(u => u.correo === usuario.correo);
            if (idx !== -1) tienda.usuarios[idx] = usuario;
            setDatosTienda(tienda);
        }
    } else {
        localStorage.setItem("carritoInvitado", JSON.stringify(carrito));
    }
}

// Aumenta la cantidad de un producto en el carrito
function aumentarCantidad(id) {
    const carrito = getCarrito();
    const producto = carrito.find(item => item.id === id);
    const productosEnTienda = JSON.parse(localStorage.getItem('productos')) || [];

    if (producto) {
        const productoOriginal = productosEnTienda.find(p => p.id === id);
        if (productoOriginal && producto.cantidad < productoOriginal.stock) {
            producto.cantidad++;
            setCarrito(carrito);
            renderCarrito();
        } else {
            alert("No hay más stock disponible de este producto.");
        }
    }
}

// Disminuye la cantidad de un producto en el carrito
function disminuirCantidad(id) {
    const carrito = getCarrito();
    const producto = carrito.find(item => item.id === id);
    if (!producto) return;

    if (producto.cantidad > 1) {
        producto.cantidad--;
        setCarrito(carrito);
    } else {
        quitarDelCarrito(id);
        return;
    }
    renderCarrito();
}

// Quita un producto del carrito
function quitarDelCarrito(id) {
    const carrito = getCarrito().filter(item => item.id !== id);
    setCarrito(carrito);
    renderCarrito();
    alert("Producto quitado del carrito.");
}

// Renderiza el carrito en la página
function renderCarrito() {
    const carritoBody = document.getElementById("carrito-body");
    const totalDisplay = document.getElementById("total");
    const carrito = getCarrito();
    let total = 0;

    if (!carritoBody || !totalDisplay) return;

    carritoBody.innerHTML = "";

    if (carrito.length === 0) {
        carritoBody.innerHTML = '<tr><td colspan="5" class="text-center">Tu carrito está vacío.</td></tr>';
        totalDisplay.textContent = "$0";
        return;
    }

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>
                <div class="input-group input-group-sm" style="width: 120px;">
                    <button class="btn btn-outline-secondary" type="button" onclick="disminuirCantidad('${producto.id}')">-</button>
                    <input type="text" class="form-control text-center" value="${producto.cantidad}" readonly>
                    <button class="btn btn-outline-secondary" type="button" onclick="aumentarCantidad('${producto.id}')">+</button>
                </div>
            </td>
            <td>$${subtotal}</td>
            <td><button class="btn btn-danger btn-sm" onclick="quitarDelCarrito('${producto.id}')">Quitar</button></td>
        `;
        carritoBody.appendChild(row);
    });

    totalDisplay.textContent = `$${total}`;
}

// Finaliza la compra del carrito
function finalizarCompra() {
    const carrito = getCarrito();
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const usuario = requireLogin();
    if (!usuario) return;

    const productosEnTienda = JSON.parse(localStorage.getItem('productos')) || [];

    // Actualiza stock
    carrito.forEach(item => {
        const productoTienda = productosEnTienda.find(p => p.id === item.id);
        if (productoTienda) productoTienda.stock -= item.cantidad;
    });
    localStorage.setItem('productos', JSON.stringify(productosEnTienda));

    // Crea nuevo pedido
    const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        productos: [...carrito],
        total: carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
        estado: 'Pendiente'
    };

    if (!usuario.pedidos) usuario.pedidos = [];
    usuario.pedidos.push(nuevoPedido);

    // Vacía el carrito y actualiza usuario en la tienda
    usuario.carrito = [];
    const tienda = getDatosTienda();
    const idx = tienda.usuarios.findIndex(u => u.correo === usuario.correo);
    if (idx !== -1) tienda.usuarios[idx] = usuario;
    setDatosTienda(tienda);

    alert("¡Compra realizada con éxito! Revisa tu historial de pedidos.");
    window.location.href = "perfil.html";
}

document.addEventListener("DOMContentLoaded", renderCarrito);
