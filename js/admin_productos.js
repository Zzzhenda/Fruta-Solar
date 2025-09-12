//admin_productos.js

document.addEventListener("DOMContentLoaded", () => {
    const formProducto = document.getElementById('formProducto');
    const listaProductos = document.getElementById('listaProductos');
    const btnCancelar = document.getElementById('btnCancelar');
    const productoIdInput = document.getElementById('productoId');

    // Carga los productos. Intenta obtenerlos de localStorage primero.
    // Si no existen en localStorage, usa el array de 'productos.js' como base.
    let productos = JSON.parse(localStorage.getItem('productos')) || window.productos || [];

    // --- FUNCIONES DE GESTIÓN ---

    function renderProductos() {
        listaProductos.innerHTML = '';
        if (productos.length === 0) {
            listaProductos.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos registrados.</td></tr>';
            return;
        }
        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.categoria}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editarProducto('${producto.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    function guardarProductos() {
        // Guarda los productos en localStorage para que persistan los cambios.
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    // Agrega o edita un producto
    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = productoIdInput.value;
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const categoria = document.getElementById('categoria').value;
        const imagen = document.getElementById('imagen').value;
        const descripcion = document.getElementById('descripcion').value;
        const origen = document.getElementById('origen').value;
        const sostenibilidad = document.getElementById('sostenibilidad').value;
        const receta = document.getElementById('receta').value;
        const stock = parseInt(document.getElementById('stock').value);

        if (id) {
            // Editar producto existente
            const index = productos.findIndex(p => p.id === id);
            if (index !== -1) {
                productos[index] = { ...productos[index], nombre, precio, categoria, imagen, descripcion, origen, sostenibilidad, receta, stock };
            }
            alert("Producto actualizado con éxito.");
        } else {
            // Agregar nuevo producto
            const nuevoProducto = {
                id: Date.now().toString(),
                nombre,
                precio,
                categoria,
                imagen,
                descripcion,
                origen,
                sostenibilidad,
                receta,
                stock
            };
            productos.push(nuevoProducto);
            alert("Producto agregado con éxito.");
        }

        formProducto.reset();
        productoIdInput.value = '';
        guardarProductos();
        renderProductos();
    });

    // Carga los datos del producto a editar en el formulario
    window.editarProducto = function(id) {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            productoIdInput.value = producto.id;
            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('precio').value = producto.precio;
            document.getElementById('categoria').value = producto.categoria;
            document.getElementById('imagen').value = producto.imagen;
            document.getElementById('descripcion').value = producto.descripcion;
            document.getElementById('origen').value = producto.origen;
            document.getElementById('sostenibilidad').value = producto.sostenibilidad;
            document.getElementById('receta').value = producto.receta;
            document.getElementById('stock').value = producto.stock;
        }
    };

    // Elimina un producto
    window.eliminarProducto = function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            productos = productos.filter(p => p.id !== id);
            guardarProductos();
            renderProductos();
            alert("Producto eliminado con éxito.");
        }
    };
    
    // Cancela la edición y limpia el formulario
    btnCancelar.addEventListener('click', () => {
        formProducto.reset();
        productoIdInput.value = '';
    });

    // Renderiza la lista de productos al cargar la página
    renderProductos();
});