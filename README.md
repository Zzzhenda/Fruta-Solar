#  Fruto Solar - E-Commerce de Frutas y Verduras

Plataforma web para la gestión y venta de productos agrícolas locales. Proyecto desarrollado como evaluación final para la asignatura de Desarrollo Full Stack.

##  Tecnologías Utilizadas

### Backend
* **Java 17** con **Spring Boot 3**
* **Spring Security** & **JWT** para autenticación.
* **JPA / Hibernate** para ORM.
* **MySQL** como base de datos relacional.
* **Maven** para gestión de dependencias.
* **Swagger/OpenAPI** para documentación de API.

### Frontend
* **React** (Vite)
* **TypeScript**
* **Bootstrap 5** para estilos responsivos.
* **Axios** para consumo de API.
* **Context API** para manejo de estado global.

## 🛠️ Instalación y Ejecución

### Requisitos Previos
* Java 17 o superior.
* Node.js y npm.
* MySQL Server corriendo (Base de datos: `frutas_db`).

### Pasos Backend
1.  Clonar el repositorio.
2.  Configurar credenciales de BD en `src/main/resources/application.properties`.
3.  Ejecutar: `./mvnw spring-boot:run`

### Pasos Frontend
1.  Entrar a la carpeta del frontend.
2.  Instalar dependencias: `npm install`.
3.  Ejecutar servidor de desarrollo: `npm run dev`.

##  Funcionalidades Principales
* **Seguridad:** Login y Registro con encriptación de contraseñas y tokens JWT.
* **Gestión de Roles:** Vistas diferenciadas para Admin y Cliente.
* **Carrito de Compras:** Lógica completa de agregar/quitar y cálculo de totales.
* **Órdenes:** Generación de pedidos con relación histórica de precios (One-to-Many).
* **Panel Admin:** CRUD completo de productos y visualización de métricas.

##  Autor
* **Victor Gutierrez** - *Desarrollador Full Stack*
