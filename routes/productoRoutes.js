import express from 'express';
import {
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    eliminarProductoId,
    actualizarProductoId
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoId);
router.delete('/:id', eliminarProductoId);
router.put('/:id', actualizarProductoId);

export default router;