import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    imagenUrl: {
        type: String,
        default: '',
        required: true
    },
    categoria: {
        type: String,
        enum: ['ampoule', 'cleanser', 'solarProtection'],   
        required: true
    }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;