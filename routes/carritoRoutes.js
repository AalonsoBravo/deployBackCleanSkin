import express from 'express';
import { agregarCarrito, vaciarCarrito, obtenerCarrito, eliminarDeCarrito } from '../controllers/carritoController.js';

const router = express.Router();

router.post('/agregarAlCarrito/:_id', agregarCarrito);
router.put('/vaciar', vaciarCarrito);
router.delete('/eliminarDeCarrito/:productoId', eliminarDeCarrito);
router.get('/obtenerCarrito', obtenerCarrito);

export default router;