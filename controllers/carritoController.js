import { validationResult } from "express-validator";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";
// creando las funciones del carrito
// crear o agregar al carrito
export const agregarCarrito = async (req, res) =>{
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        console.log(`Errores de validación: ${JSON.stringify(errores.array())}`);
        return res.status(400).json({
            mensaje: 'Errores de validación',
            errores: errores.array()
        });
    }
    const { _id } = req.params;
    console.log(`ID del producto recibido: ${_id}`);
    try {
        console.log(`ID del producto a agregar: ${_id}`);
        const productoId = await Producto.findById(_id);
        console.log(`Producto encontrado: ${JSON.stringify(productoId)}`);
        if (!productoId) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado.'
            });
        }
        let carrito = await Carrito.findOne();
        console.log(`Carrito encontrado: ${JSON.stringify(carrito)}`);
        if(!carrito) {
            carrito = new Carrito({
                productos : [{
                    productoId: productoId._id,
                    cantidad: 1
                }]
            });
        } else {
            const productoEnCarrito = carrito.productos.find(
                (item) => item.productoId.equals(_id)
            );
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += 1;
                console.log(`Cantidad actualizada para el producto en el carrito: ${JSON.stringify(productoEnCarrito)}`);
            } else {
                carrito.productos.push({
                    productoId: productoId._id,
                    cantidad: 1
                });
                console.log(`Producto agregado al carrito: ${JSON.stringify(carrito.productos[carrito.productos.length - 1])}`);
            }
        }
        await carrito.save();
        res.status(200).json({
            mensaje: 'Producto agrego al carrito',
            carrito: {
                id: carrito._id,
                totalItems: carrito.productos.length,
                producto: carrito.productos
            }
        });
    } catch (error) {
        console.log(`Errorr al agregar producto al carrito: ${error.message}`);
        console.error(`Error al agregar producto al carrito: ${error.message}`);
        return res.status(500).json({
            Error: "Error interno del servidor."
        });
    }
}

// vaciar carrito
export const vaciarCarrito = async (req, res) =>{
    const { carritoId } = req.body;
    console.log(`🛒Datos recibidos para vaciar carrito: ${JSON.stringify(req.body)}`);

    try {
        const carrito = await Carrito.findById(carritoId);
        console.log(`Carrito encontrado: ${JSON.stringify(carrito)}`);
        if (!carrito) {
            return res.status(404).json({
                mensaje: 'Carrito no encontrado.'
            })
        }
        // vaciamos el carrito
        carrito.productos = [];
        await carrito.save();
        console.log(`Carrito vaciado: ${JSON.stringify(carrito)}`);
        return res.status(200).json({
            mensaje: 'Carrito vaciado exitosamente.'
        });
    } catch (error) {
        console.error(`Error al vaciar carrito: ${error.message}`);
        return res.status(500).json({
            Error: "Error interno del servidor."
        });
    }
}

// mostrar el carrito
export const obtenerCarrito = async (req, res) => {
    try {
        const carrito = await Carrito.findOne().populate('productos.productoId');
        
        if (!carrito || carrito.productos.length === 0) {
            console.log(`Carrito no encontrado o vacío: ${JSON.stringify(carrito)}`);
            return res.status(200).json({
                mensaje: 'El carrito está vacío.',
                carrito: []
            });
        }

        const productosFormateados = carrito.productos.map(item => ({
            id: item.productoId._id,
            nombre: item.productoId.nombre,
            precio: item.productoId.precio,
            imagenUrl: item.productoId.imagenUrl,
            cantidad: item.cantidad,
            subtotal: item.productoId.precio * item.cantidad
        }));

        const total = productosFormateados.reduce((acc, item) => acc + item.subtotal, 0);
        console.log(`Carrito obtenido correctamente: ${JSON.stringify(carrito)}`);

        res.status(200).json({
            mensaje: 'Carrito obtenido correctamente.',
            carrito: {
                id: carrito._id,
                productos: productosFormateados,
                total
            }
        });
    } catch (error) {
        console.error(`Error al obtener el carrito: ${error.message}`);
        res.status(500).json({
            error: 'Error interno del servidor.'
        });
    }
};

// eliminamos un item del carrito
export const eliminarDeCarrito = async (req, res) => {
    const { productoId } = req.params;
    console.log(`🪪ID del producto a eliminar del carrito: ${productoId}`);

    try {
        const carrito = await Carrito.findOne();
        if (!carrito) {
            return res.status(404).json({
                mensaje: 'Carrito no encontrado.'
            });
        }

        const productosAntes = carrito.productos.length;
        carrito.productos = carrito.productos.filter(
            item => !item.productoId.equals(productoId)
        );

        const productosDespues = carrito.productos.length;
        console.log(`Productos antes: ${productosAntes}, Productos después: ${productosDespues}`);

        if (productosAntes === productosDespues) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado en el carrito.'
            });
        }

        await carrito.save();
        console.log(`Producto eliminado del carrito: ${productoId}`);

        res.status(200).json({
            mensaje: 'Producto eliminado del carrito.',
            carrito: {
                id: carrito._id,
                productos: carrito.productos
            }
        });
    } catch (error) {
        console.error(`Error al eliminar producto del carrito: ${error.message}`);
        return res.status(500).json({
            error: 'Error interno del servidor.'
        });
    }
}