// perfil.js


document.addEventListener('DOMContentLoaded', function () {

    const perfilDiv = document.getElementById('perfilUsuario');

    // Obtenemos la estructura completa de localStorage

    const miTienda = JSON.parse(localStorage.getItem('miTienda')) || { usuarios: [], usuarioActual: null };

    const correoUsuarioActual = miTienda.usuarioActual;


    if (!correoUsuarioActual) {

        // Si no hay correo de usuario actual, redirige a login.

        window.location.href = "login.html";

        return;

    }


    // Buscamos el objeto de usuario completo usando el correo

    let usuario = miTienda.usuarios.find(u => u.correo === correoUsuarioActual);


    if (!usuario) {

        // Manejar el caso donde el usuario no se encuentra

        console.error('Usuario no encontrado.');

        miTienda.usuarioActual = null;

        localStorage.setItem('miTienda', JSON.stringify(miTienda));

        window.location.href = "login.html";

        return;

    }


    function mostrarPerfil(editando = false) {

        if (!editando) {

            perfilDiv.innerHTML = `

<div class="card">

<div class="card-body">

<h5 class="card-title">${usuario.nombre}</h5>

<p class="card-text"><strong>Correo:</strong> ${usuario.correo}</p>

<p class="card-text"><strong>Teléfono:</strong> ${usuario.telefono || '-'}</p>

<p class="card-text"><strong>Dirección:</strong> ${usuario.direccion || '-'}</p>

<button id="editarPerfil" class="btn btn-primary mt-3">Editar perfil</button>

</div>

</div>

`;

            document.getElementById('editarPerfil').addEventListener('click', () => mostrarPerfil(true));

        } else {

            perfilDiv.innerHTML = `

<div class="card">

<div class="card-body">

<form id="formEditarPerfil">

<div class="mb-3">

<label class="form-label">Nombre</label>

<input type="text" class="form-control" id="editNombre" value="${usuario.nombre}" required>

</div>

<div class="mb-3">

<label class="form-label">Teléfono</label>

<input type="tel" class="form-control" id="editTelefono" value="${usuario.telefono || ''}">

</div>

<div class="mb-3">

<label class="form-label">Dirección</label>

<input type="text" class="form-control" id="editDireccion" value="${usuario.direccion || ''}">

</div>

<button type="submit" class="btn btn-success">Guardar</button>

<button type="button" id="cancelarEdicion" class="btn btn-secondary ms-2">Cancelar</button>

</form>

</div>

</div>

`;

            document.getElementById('cancelarEdicion').addEventListener('click', () => mostrarPerfil(false));

            document.getElementById('formEditarPerfil').addEventListener('submit', function (e) {

                e.preventDefault();

                // Actualizar los datos del usuario logueado en la variable local

                usuario.nombre = document.getElementById('editNombre').value.trim();

                usuario.telefono = document.getElementById('editTelefono').value.trim();

                usuario.direccion = document.getElementById('editDireccion').value.trim();


                // Actualizar en el arreglo de usuarios principal en localStorage

                const idx = miTienda.usuarios.findIndex(u => u.correo === usuario.correo);

                if (idx !== -1) {

                    miTienda.usuarios[idx] = usuario;

                }


                // Guardar la estructura completa de vuelta en localStorage

                localStorage.setItem('miTienda', JSON.stringify(miTienda));

                mostrarPerfil(false);

            });

        }

    }


    mostrarPerfil(false);

    // Agregamos el event listener para el nuevo botón de cierre de sesión

    document.getElementById('cerrarSesionBtn').addEventListener('click', function () {

        logout(); // Llama a la función de ui.js para cerrar sesión

    });

});