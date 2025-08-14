// backend con es6
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// conectamos a la base de datos de mongoDB
mongoose.connect(process.env.MONGO_ATLAS).then(() => {
    console.log('Conectado a la base de datos de MongoDB');
}).catch((error) => {
    console.error('Error al conectar a la base de datos de MongoDB:', error);
});

// ruta del healthcheck
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Hola mundo</h1>`);
});

// creamos un schema para los usuarios
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

//ruta del registro
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    
    const newUser = new User({
        email,
        password
    });

    newUser.save().then(() => {
        res.status(201).json({
            message: 'Usuario registrado correctamente'
        });
    }).catch((error) => {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({
            message: 'Error al registrar usuario'
        });
    });
});

// ruta del login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    console.log(`Intentando iniciar sesión con email: ${email} y password: ${password}`);

    User.findOne({ email, password }).then((user) => {
        if (user) {
            res.status(200).json({
                message: 'Usuario logueado correctamente'
            });
        } else {
            res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }
    }).catch((error) => {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({
            message: 'Error al iniciar sesión'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});