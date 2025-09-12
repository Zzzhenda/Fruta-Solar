// pedidos.js

document.addEventListener("DOMContentLoaded", () => {
    function renderHistorialPedidos() {
        const pedidosDiv = document.getElementById("historial-pedidos");
        if (!pedidosDiv) return;

        const miTienda = JSON.parse(localStorage.getItem('miTienda')) || { usuarios: [], usuarioActual: null };
        const correoUsuarioActual = miTienda.usuarioActual;

        if (!correoUsuarioActual) {
            pedidosDiv.innerHTML = `<p class="text-center">Debes iniciar sesión para ver tu historial de pedidos.</p>`;
            return;
        }

        const usuario = miTienda.usuarios.find(u => u.correo === correoUsuarioActual);
        
        if (!usuario || !usuario.pedidos || usuario.pedidos.length === 0) {
            pedidosDiv.innerHTML = `<p class="text-center">Aún no tienes pedidos. ¡Empieza a comprar en nuestro <a href="catalogo.html">catálogo</a>!</p>`;
            return;
        }
        
        const pedidos = usuario.pedidos;

        let htmlContent = '';
        pedidos.forEach(pedido => {
            let productosHtml = '';
            pedido.productos.forEach(producto => {
                productosHtml += `
                    <li>${producto.nombre} - Cantidad: ${producto.cantidad} - Subtotal: $${producto.precio * producto.cantidad}</li>
                `;
            });
            
            // Determina el estado del pedido y el color de la clase
            const estado = pedido.estado || 'Pendiente';
            let estadoColorClass = 'text-primary'; // Por defecto
            if (estado === 'Procesando') estadoColorClass = 'text-info';
            if (estado === 'Enviado') estadoColorClass = 'text-warning';
            if (estado === 'Entregado') estadoColorClass = 'text-success';
            if (estado === 'Cancelado') estadoColorClass = 'text-danger';

            htmlContent += `
                <div class="card mb-4 shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="my-0">Pedido #${pedido.id}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Estado:</strong> <span class="${estadoColorClass}">${estado}</span></p>
                        <p class="card-text"><strong>Fecha:</strong> ${pedido.fecha} a las ${pedido.hora}</p>
                        <p class="card-text"><strong>Total:</strong> $${pedido.total}</p>
                        <h6>Productos:</h6>
                        <ul class="list-unstyled">${productosHtml}</ul>
                    </div>
                </div>
            `;
        });

        pedidosDiv.innerHTML = htmlContent;
    }

    // Asegúrate de que esta función se llame cuando la página cargue
    renderHistorialPedidos();
});