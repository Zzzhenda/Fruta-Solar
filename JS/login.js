document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); // evitar envío real

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-msg");

    if(email === "" || password === "") {
        errorMsg.textContent = "Todos los campos son obligatorios.";
        return;
    }

    // Validación simple de ejemplo
    if(!email.includes("@")) {
        errorMsg.textContent = "Ingrese un correo válido.";
        return;
    }

    errorMsg.textContent = "";
    alert("Inicio de sesión exitoso (simulado)!");
});
