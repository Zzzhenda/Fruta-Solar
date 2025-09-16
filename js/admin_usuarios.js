// admin_usuarios.js

document.addEventListener('DOMContentLoaded', function() {
  const tablaDiv = document.getElementById('usuariosTabla');
  const mensaje = document.getElementById('mensaje');
  const formCrear = document.getElementById('formCrearUsuario');

  function renderUsuarios() {
    let miTienda = JSON.parse(localStorage.getItem('miTienda')) || { usuarios: [], usuarioActual: null };
    let usuarios = miTienda.usuarios;

    if (usuarios.length === 0) {
      tablaDiv.innerHTML = "<p class='text-center'>No hay usuarios registrados.</p>";
      return;
    }

    let tabla = `
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    usuarios.forEach((u, idx) => {
      tabla += `
        <tr>
          <td>${u.nombre}</td>
          <td>${u.correo}</td>
          <td>${u.telefono || '-'}</td>
          <td>${u.direccion || '-'}</td>
          <td>${u.rol || 'cliente'}</td>
          <td>
            <button class="btn btn-sm btn-primary me-2" onclick="editarUsuario(${idx})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${idx})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tabla += "</tbody></table>";
    tablaDiv.innerHTML = tabla;
  }

  // Editar usuario
  window.editarUsuario = function(idx) {
    let miTienda = JSON.parse(localStorage.getItem('miTienda'));
    const u = miTienda.usuarios[idx];
    tablaDiv.innerHTML = `
      <form id="formEditarUsuario" class="card p-3">
        <h5>Editar Usuario</h5>
        <div class="mb-2">
          <label>Nombre</label>
          <input type="text" class="form-control" id="editNombre" value="${u.nombre}" required>
        </div>
        <div class="mb-2">
          <label>Teléfono</label>
          <input type="tel" class="form-control" id="editTelefono" value="${u.telefono || ''}">
        </div>
        <div class="mb-2">
          <label>Dirección</label>
          <input type="text" class="form-control" id="editDireccion" value="${u.direccion || ''}">
        </div>
        <div class="mb-2">
          <label>Rol</label>
          <select class="form-select" id="editRol">
            <option value="cliente" ${u.rol === "cliente" ? "selected" : ""}>Cliente</option>
            <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Administrador</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">Guardar</button>
        <button type="button" class="btn btn-secondary ms-2" id="cancelarEdicion">Cancelar</button>
      </form>
    `;

    document.getElementById('cancelarEdicion').onclick = renderUsuarios;
    document.getElementById('formEditarUsuario').onsubmit = function(e) {
      e.preventDefault();
      u.nombre = document.getElementById('editNombre').value.trim();
      u.telefono = document.getElementById('editTelefono').value.trim();
      u.direccion = document.getElementById('editDireccion').value.trim();
      u.rol = document.getElementById('editRol').value;
      miTienda.usuarios[idx] = u;
      localStorage.setItem('miTienda', JSON.stringify(miTienda));
      mensaje.textContent = "Usuario actualizado correctamente.";
      mensaje.style.color = "green";
      renderUsuarios();
    };
  };

  // Eliminar usuario
  window.eliminarUsuario = function(idx) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    let miTienda = JSON.parse(localStorage.getItem('miTienda'));
    miTienda.usuarios.splice(idx, 1);
    localStorage.setItem('miTienda', JSON.stringify(miTienda));
    mensaje.textContent = "Usuario eliminado.";
    mensaje.style.color = "red";
    renderUsuarios();
  };

  // Crear usuario desde el formulario
  if (formCrear) {
    formCrear.addEventListener('submit', function(e) {
      e.preventDefault();
      let miTienda = JSON.parse(localStorage.getItem('miTienda')) || { usuarios: [], usuarioActual: null };
      const correo = document.getElementById('nuevoCorreo').value.trim().toLowerCase();
      if (miTienda.usuarios.some(u => u.correo === correo)) {
        alert("El correo ya está registrado.");
        return;
      }
      const nuevoUsuario = {
    nombre: document.getElementById('nuevoNombre').value.trim(),
    correo,
    telefono: document.getElementById('nuevoTelefono').value.trim(),
    direccion: document.getElementById('nuevoDireccion').value.trim(),
    password: document.getElementById('nuevoPassword').value, 
    rol: document.getElementById('nuevoRol').value
};
      miTienda.usuarios.push(nuevoUsuario);
      localStorage.setItem('miTienda', JSON.stringify(miTienda));
      formCrear.reset();
      alert("Usuario creado correctamente.");
      renderUsuarios();
    });
  }

  renderUsuarios();
});
