# deployBackCleanSkin

Backend para CleanSkin, proyecto de gestión de productos y carrito de compras.

## Tecnologías
- Node.js
- Express
- MongoDB (Mongoose)
- JWT para autenticación

## Instalación
1. Clona el repositorio:
   ```
   git clone https://github.com/AalonsoBravo/deployBackCleanSkin.git
   ```
2. Instala dependencias:
   ```
   npm install
   ```
3. Configura el archivo `.env` con tus variables:
   ```
   PORT=9000
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_clave_secreta
   ```

## Scripts
- `npm run server` — Inicia el servidor en modo desarrollo
- `npm start` — Inicia el servidor en modo producción

## Endpoints principales

### Autenticación
- `POST /api/login` — Iniciar sesión
- `POST /api/register` — Registrar usuario

### Productos
- `GET /api/productos` — Listar productos
- `POST /api/productos` — Crear producto

### Carrito
- `POST /api/carritos/agregarAlCarrito/:_id` — Agregar producto al carrito
- `GET /api/carritos/obtenerCarrito` — Obtener carrito
- `PUT /api/carritos/vaciar` — Vaciar carrito
- `DELETE /api/carritos/eliminarDeCarrito/:productoId` — Eliminar producto del carrito

## Notas
- Recuerda iniciar MongoDB antes de correr el backend.
- El frontend debe consumir las rutas según la configuración del archivo `.env`.

---
Desarrollado por Alonso Bravo
