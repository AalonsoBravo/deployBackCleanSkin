import Producto from "../models/Producto.js";

//para crear el producto
export const crearProducto = async (req, res) =>{
    try {
        const { nombre, descripcion, precio, cantidad, imagenUrl, categoria } = req.body;
        console.log(`Datos recibidos para crear producto: ${JSON.stringify(req.body)}`);

        if (!nombre || !precio || !cantidad || !imagenUrl || !categoria){
            return res.status(400).json({ 
                message: 'Todos los campos son obligatorios'
            });
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            cantidad,
            imagenUrl,
            categoria
        });
        console.log(`Producto recibido en el servidor: ${JSON.stringify(nuevoProducto)}`);

        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({
            message: 'Producto creado correctamente',
            producto: productoGuardado
        });
        console.log(`Producto guardado en la base de datos: ${JSON.stringify(productoGuardado)}`);
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el producto',
            error: error.message
        });
    }
}

// para obtener todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json({
            message: 'Productos obtenidos correctamente',
            productos
        });
        console.log(`Productos obtenidos: ${JSON.stringify(productos)}`);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
}

// para obtener por id
export const obtenerProductoId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`ID recibido para obtener producto: ${id}`);
        const producto = await Producto.findById(id);
        console.log(`Producto encontrado: ${JSON.stringify(producto)}`);
        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
            console.log(`Producto con ID ${id} no encontrado`);
        }
        res.status(200).json({
            message: 'Producto obtenido correctamente',
            producto
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el producto',
            error: error.message
        });
    }
}

//para eliminar por id
export const eliminarProductoId = async (req, res) =>{
    try {
        const { id } = req.params;
        console.log(`ID recibido para eliminar producto: ${id}`);
        const eliminado = await Producto.findByIdAndDelete(id);
        console.log(`Producto eliminado: ${JSON.stringify(eliminado)}`);
        if (!eliminado) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            message: 'Producto eliminado correctamente',
            producto: eliminado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
}

// para actualizar por id
export const actualizarProductoId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`ID recibido para actualizar producto: ${id}`);
        const datosActualizados = req.body;
        console.log(`Datos recibidos para actualizar: ${JSON.stringify(datosActualizados)}`);

        const productoActualizado = await Producto.findByIdAndUpdate(id, datosActualizados, {
            new: true,
            runValidators: true
        });
        console.log(`Producto actualizado: ${JSON.stringify(productoActualizado)}`);
        if(!productoActualizado) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            message: 'Producto actualizado correctamente',
            producto: productoActualizado
        });
        console.log(`Producto con ID ${id} actualizado correctamente`);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
}