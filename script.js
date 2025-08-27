document.getElementById('formulario-contacto').addEventListener('submit', function(event) {
    event.preventDefault();
    let nombre = document.getElementById('nombre').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let mensajeError = document.getElementById('mensaje-error');

    mensajeError.textContent = ''; // Resetear mensajes de error

    if (nombre.length < 3) {
        mensajeError.textContent = 'El nombre debe tener al menos 3 caracteres.';
        return;
    }

    if (!email.includes('@')) {
        mensajeError.textContent = 'Por favor, ingresa un correo electrónico válido.';
        return;
    }

    if (password.length < 6) {
        mensajeError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }

    // Si todo está correcto, se podría enviar el formulario
    alert('¡Formulario enviado con éxito!');
    this.reset();
});