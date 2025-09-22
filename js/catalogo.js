document.addEventListener("DOMContentLoaded", () => {
    let textoBusqueda = "";
    let categoriaSeleccionada = "todos"; // Estado inicial: muestra todos los productos

    const inputBuscar = document.getElementById("buscarProducto");
    if (inputBuscar) {
        inputBuscar.addEventListener("keyup", e => {
            textoBusqueda = e.target.value.toLowerCase();
            renderCatalogo();
        });
    }

    // Agrega listeners a los botones de categoría
    document.querySelectorAll('[data-categoria]').forEach(button => {
        button.addEventListener('click', e => {
            // Actualiza la categoría seleccionada y el estilo de los botones
            categoriaSeleccionada = e.target.dataset.categoria;
            document.querySelectorAll('[data-categoria]').forEach(btn => {
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-success');
            });
            e.target.classList.remove('btn-outline-success');
            e.target.classList.add('btn-success');
            renderCatalogo(); // Vuelve a renderizar el catálogo con el nuevo filtro
        });
    });

    // Agrega un producto al carrito (usuario o invitado)
    function agregarAlCarrito(producto) {
        const productosEnTienda = JSON.parse(localStorage.getItem('productos')) || window.productos;
        const productoActualizado = productosEnTienda.find(p => p.id === producto.id);

        if (!productoActualizado || productoActualizado.stock <= 0) {
            alert("¡Producto agotado!");
            return;
        }

        const tienda = getDatosTienda();
        const usuario = tienda.usuarios.find(u => u.correo === tienda.usuarioActual);

        let carrito;
        if (usuario) {
            if (!usuario.carrito) usuario.carrito = [];
            carrito = usuario.carrito;
        } else {
            carrito = JSON.parse(localStorage.getItem("carritoInvitado")) || [];
        }

        const existente = carrito.find(item => item.id === producto.id);
        if (existente) {
            if (existente.cantidad >= productoActualizado.stock) {
                alert("No puedes agregar más de este producto, ¡has alcanzado el stock máximo!");
                return;
            }
            existente.cantidad++;
        } else {
            const productoAAgregar = { ...producto, cantidad: 1 };
            carrito.push(productoAAgregar);
        }

        if (usuario) {
            const idx = tienda.usuarios.findIndex(u => u.correo === usuario.correo);
            if (idx !== -1) tienda.usuarios[idx] = usuario;
            setDatosTienda(tienda);
        } else {
            localStorage.setItem("carritoInvitado", JSON.stringify(carrito));
        }

        alert(`Producto "${producto.nombre}" agregado al carrito.`);
    }

    // Renderiza el catálogo de productos
    function renderCatalogo() {
        const catalogoDiv = document.getElementById("catalogo-lista");
        if (!catalogoDiv) return;

        const productos = JSON.parse(localStorage.getItem('productos')) || window.productos;
        catalogoDiv.innerHTML = '';

        // Filtra los productos según la categoría seleccionada
        const productosFiltrados = productos.filter(p => {
            const porCategoria = categoriaSeleccionada === "todos" || p.categoria === categoriaSeleccionada;
            const porBusqueda = p.nombre.toLowerCase().includes(textoBusqueda);
            return porCategoria && porBusqueda;
        });

        // Agrupa productos por categoría para una presentación más ordenada
        const productosPorCategoria = productosFiltrados.reduce((acc, producto) => {
            const categoria = producto.categoria;
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(producto);
            return acc;
        }, {});

        Object.keys(productosPorCategoria).forEach(categoria => {
            const section = document.createElement('section');
            section.className = 'my-4';
            section.innerHTML = `<h3 class="catalogo-categoria text-center text-success">${categoria}</h3>`;
            const row = document.createElement('div');
            row.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';

            productosPorCategoria[categoria].forEach(producto => {
                const col = document.createElement('div');
                col.className = 'col';

                const btnClass = producto.stock > 0 ? "btn-success" : "btn-secondary";
                const isDisabled = producto.stock <= 0 ? "disabled" : "";

                col.innerHTML = `
                    <div class="card h-100 shadow-sm producto-card">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-uppercase">${producto.nombre}</h5>
                            <p><strong>Precio:</strong> $${producto.precio} CLP</p>
                            <p class="small">${producto.descripcion}</p>
                            <div class="mt-auto d-flex justify-content-center gap-2 flex-wrap">
                                <button class="btn ${btnClass}" ${isDisabled}>Agregar al carrito</button>
                                <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="collapse" data-bs-target="#info${producto.id}">Más información</button>
                            </div>
                            <div class="collapse mt-2 text-start small" id="info${producto.id}">
                                <p><strong>Origen:</strong> ${producto.origen}</p>
                                <p><strong>Prácticas sostenibles:</strong> ${producto.sostenibilidad}</p>
                                <p><strong>Receta sugerida:</strong> ${producto.receta}</p>
                            </div>
                        </div>
                    </div>
                `;

                col.querySelector(".btn-success, .btn-secondary").onclick = () => agregarAlCarrito(producto);
                row.appendChild(col);
            });

            section.appendChild(row);
            catalogoDiv.appendChild(section);
        });
    }

    renderCatalogo();
});