document.addEventListener("DOMContentLoaded", () => {
    let textoBusqueda = "";

    const inputBuscar = document.getElementById("buscarProducto");
    if (inputBuscar) {
        inputBuscar.addEventListener("keyup", e => {
            textoBusqueda = e.target.value.toLowerCase();
            renderCatalogo();
        });
    }

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
            carrito.push({ ...producto, cantidad: 1 });
        }

        if (usuario) {
            usuario.carrito = carrito;
            localStorage.setItem('miTienda', JSON.stringify(tienda));
            alert(`${producto.nombre} se agregó a tu carrito.`);
        } else {
            localStorage.setItem("carritoInvitado", JSON.stringify(carrito));
            alert(`${producto.nombre} se agregó al carrito (como invitado).`);
        }
    }

    // Renderiza el catálogo filtrado
    function renderCatalogo() {
        const catalogoDiv = document.getElementById("catalogo-lista");
        if (!catalogoDiv) return;

        const productos = JSON.parse(localStorage.getItem('productos')) || window.productos;
        if (!Array.isArray(productos) || productos.length === 0) {
            catalogoDiv.innerHTML = "<p class='text-center'>No se pudieron cargar los productos. Por favor, recarga la página.</p>";
            return;
        }

        const productosFiltrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(textoBusqueda) ||
            p.categoria.toLowerCase().includes(textoBusqueda)
        );

        if (productosFiltrados.length === 0) {
            catalogoDiv.innerHTML = `<p class="text-center">No se encontraron productos que coincidan con "${textoBusqueda}".</p>`;
            return;
        }

        const categorias = {};
        productosFiltrados.forEach(p => {
            if (!categorias[p.categoria]) categorias[p.categoria] = [];
            categorias[p.categoria].push(p);
        });

        catalogoDiv.innerHTML = "";

        Object.keys(categorias).forEach(categoria => {
            const section = document.createElement("section");
            section.className = "mb-5";
            section.innerHTML = `<h3 class="categoria-title mb-4">${categoria}</h3>`;

            const row = document.createElement("div");
            row.className = "row row-cols-1 row-cols-md-3 g-4";

            categorias[categoria].forEach(producto => {
                const col = document.createElement("div");
                col.className = "col";

                let stockText = "";
                let btnClass = "btn-success";
                let isDisabled = "";

                if (producto.stock === 0) {
                    stockText = `<p class="stock-info small text-danger">¡Agotado!</p>`;
                    btnClass = "btn-secondary";
                    isDisabled = "disabled";
                } else if (producto.stock <= 10) {
                    stockText = `<p class="stock-info small text-danger">¡Últimas ${producto.stock} unidades!</p>`;
                }

                col.innerHTML = `
                    <div class="card h-100 text-center">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-uppercase">${producto.nombre}</h5>
                            <p><strong>Precio:</strong> $${producto.precio} CLP</p>
                            <p class="small">${producto.descripcion}</p>
                            ${stockText}
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
