//admin_reportes.js

document.addEventListener("DOMContentLoaded", () => {

    function getDatosTienda() {
        return JSON.parse(localStorage.getItem('miTienda')) || { usuarios: [], usuarioActual: null };
    }

    function generarReportes() {
        const miTienda = getDatosTienda();
        const usuarios = miTienda.usuarios || [];
        
        let todosLosPedidos = [];
        let totalIngresos = 0;
        let ventasPorProducto = {};
        let pedidosPorEstado = {
            'Pendiente': 0,
            'Procesando': 0,
            'Enviado': 0,
            'Entregado': 0,
            'Cancelado': 0
        };

        // 1. Obtener todos los pedidos y calcular ingresos y ventas por producto
        usuarios.forEach(usuario => {
            const pedidosUsuario = usuario.pedidos || [];
            pedidosUsuario.forEach(pedido => {
                todosLosPedidos.push(pedido);
                // Si el pedido no está cancelado, cuenta los ingresos y productos vendidos
                if (pedido.estado !== 'Cancelado') {
                    totalIngresos += pedido.total;
                    pedido.productos.forEach(producto => {
                        if (!ventasPorProducto[producto.nombre]) {
                            ventasPorProducto[producto.nombre] = {
                                cantidad: 0,
                                ingresos: 0
                            };
                        }
                        ventasPorProducto[producto.nombre].cantidad += producto.cantidad;
                        ventasPorProducto[producto.nombre].ingresos += producto.cantidad * producto.precio;
                    });
                }
                // Contar pedidos por estado
                const estado = pedido.estado || 'Pendiente';
                pedidosPorEstado[estado] += 1;
            });
        });

        // 2. Renderizar los datos en el HTML
        
        // Indicadores principales
        document.getElementById('ingresosTotales').textContent = `$${totalIngresos.toLocaleString('es-CL')}`;
        document.getElementById('totalPedidos').textContent = todosLosPedidos.length;
        document.getElementById('totalClientes').textContent = usuarios.length;
        
        // Tabla de ventas por producto
        const ventasTablaBody = document.getElementById('ventasPorProducto');
        ventasTablaBody.innerHTML = '';
        const productosVendidos = Object.keys(ventasPorProducto).sort((a, b) => ventasPorProducto[b].ingresos - ventasPorProducto[a].ingresos);
        productosVendidos.forEach(nombreProducto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nombreProducto}</td>
                <td>${ventasPorProducto[nombreProducto].cantidad}</td>
                <td>$${ventasPorProducto[nombreProducto].ingresos.toLocaleString('es-CL')}</td>
            `;
            ventasTablaBody.appendChild(row);
        });

        // Tabla de pedidos por estado
        const pedidosTablaBody = document.getElementById('pedidosPorEstado');
        pedidosTablaBody.innerHTML = '';
        Object.keys(pedidosPorEstado).forEach(estado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${estado}</td>
                <td>${pedidosPorEstado[estado]}</td>
            `;
            pedidosTablaBody.appendChild(row);
        });
    }
    
    // Generar los reportes al cargar la página
    generarReportes();
});