//admin_pedidos.js

function actualizarEstado(pedidoId, nuevoEstado) {
    const miTienda = getDatosTienda();
    let pedidoEncontrado = false;
    
    for (const usuario of miTienda.usuarios) {
        const pedido = usuario.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.estado = nuevoEstado;
            pedidoEncontrado = true;
            break;
        }
    }

    if (pedidoEncontrado) {
        localStorage.setItem('miTienda', JSON.stringify(miTienda));
        renderPedidosAdmin();
        alert(`El estado del pedido #${pedidoId} ha sido actualizado a: ${nuevoEstado}`);
    } else {
        alert("No se encontró el pedido para actualizar.");
    }
}

function cancelarPedido(pedidoId) {
    if (confirm(`¿Estás seguro de que quieres cancelar el pedido #${pedidoId}?`)) {
        const miTienda = getDatosTienda();
        let pedidoEncontrado = false;

        for (const usuario of miTienda.usuarios) {
            const pedido = usuario.pedidos.find(p => p.id === pedidoId);
            if (pedido) {
                pedido.estado = 'Cancelado';
                pedidoEncontrado = true;
                break;
            }
        }

        if (pedidoEncontrado) {
            localStorage.setItem('miTienda', JSON.stringify(miTienda));
            renderPedidosAdmin();
            alert(`El pedido #${pedidoId} ha sido cancelado.`);
        }
    }
}

function verDetalles(pedidoId) {
    const miTienda = getDatosTienda();
    
    for (const usuario of miTienda.usuarios) {
        const pedido = usuario.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            const detalles = `
                --- Detalles del Pedido ---
                ID: #${pedido.id}
                Cliente: ${usuario.nombre} (${usuario.correo})
                Teléfono: ${usuario.telefono || 'No especificado'}
                Dirección: ${usuario.direccion || 'No especificada'}
                Total: $${pedido.total}
                Estado: ${pedido.estado || 'Pendiente'}
                Productos:
                ${pedido.productos.map(p => `  - ${p.nombre} (x${p.cantidad})`).join('\n')}
            `;
            alert(detalles);
            return;
        }
    }
    alert("No se encontró el pedido.");
}

// --- FUNCIÓN DE RENDERIZADO ---
// Esta función se encarga de dibujar el contenido y también es global.

function renderPedidosAdmin() {
    const pedidosDiv = document.getElementById("admin-pedidos");
    if (!pedidosDiv) return;

    const miTienda = getDatosTienda();
    const usuarios = miTienda.usuarios || [];
    
    let htmlContent = '';
    let todosLosPedidos = [];

    usuarios.forEach(usuario => {
        const pedidosUsuario = usuario.pedidos || [];
        pedidosUsuario.forEach(pedido => {
            todosLosPedidos.push({ ...pedido, cliente: usuario.nombre, correoCliente: usuario.correo });
        });
    });

    if (todosLosPedidos.length === 0) {
        pedidosDiv.innerHTML = `<p class="text-center">No hay pedidos registrados.</p>`;
        return;
    }

    todosLosPedidos.forEach(pedido => {
        let productosHtml = '';
        pedido.productos.forEach(producto => {
            productosHtml += `
                <li>${producto.nombre} - Cantidad: ${producto.cantidad} - Subtotal: $${producto.precio * producto.cantidad}</li>
            `;
        });

        let estadoColorClass = 'text-primary';
        if (pedido.estado === 'Procesando') estadoColorClass = 'text-info';
        if (pedido.estado === 'Enviado') estadoColorClass = 'text-warning';
        if (pedido.estado === 'Entregado') estadoColorClass = 'text-success';
        if (pedido.estado === 'Cancelado') estadoColorClass = 'text-danger';
        
        htmlContent += `
            <div class="card mb-4 shadow-sm">
                <div class="card-header bg-light">
                    <h5 class="my-0">Pedido #${pedido.id} <small>(${pedido.correoCliente})</small></h5>
                </div>
                <div class="card-body">
                    <p class="card-text"><strong>Fecha:</strong> ${pedido.fecha} a las ${pedido.hora}</p>
                    <p class="card-text"><strong>Total:</strong> $${pedido.total}</p>
                    <p class="card-text"><strong>Estado:</strong> <span class="${estadoColorClass}">${pedido.estado || 'Pendiente'}</span></p>
                    <h6>Productos:</h6>
                    <ul class="list-unstyled">${productosHtml}</ul>
                    <hr>
                    <div class="d-flex justify-content-center gap-2 flex-wrap">
                        <button class="btn btn-primary btn-sm" onclick="actualizarEstado(${pedido.id}, 'Procesando')">Procesando</button>
                        <button class="btn btn-info btn-sm" onclick="actualizarEstado(${pedido.id}, 'Enviado')">Enviado</button>
                        <button class="btn btn-success btn-sm" onclick="actualizarEstado(${pedido.id}, 'Entregado')">Entregado</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarPedido(${pedido.id})">Cancelar</button>
                        <button class="btn btn-secondary btn-sm" onclick="verDetalles(${pedido.id})">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
    });

    pedidosDiv.innerHTML = htmlContent;
}

// --- INVOCACIÓN ---
// El evento DOMContentLoaded ahora solo llama a la función de renderizado.
document.addEventListener("DOMContentLoaded", renderPedidosAdmin);