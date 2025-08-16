// backend con es6
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
//aqui importamos los routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productoRoutes.js';
import carritoRoutes from './routes/carritoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//usamos las rutas
app.use('/api', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/carritos', carritoRoutes);


//conexión a la base de datos
connectDB();

// ruta del healthcheck
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Hola mundo</h1>`);
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});