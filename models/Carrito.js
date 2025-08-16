import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    }
});

const carritoSchema = new mongoose.Schema({
    productos: [itemSchema],
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito;
