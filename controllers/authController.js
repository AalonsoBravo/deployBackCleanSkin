import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {

        //haremos un console.log al confirmar el registro del usuario
        const { nombre, email, password } = req.body;
        const newUser = new User({
            nombre,
            email,
            password
        });
        console.log(`contraseña: ${password}`);
        await newUser.save();
        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                _id: newUser._id,
                nombre: newUser.nombre,
                email: newUser.email
            }
        });
        console.log(`El usuario ${newUser.nombre} fue registrado correctamente con los datos: ${JSON.stringify(newUser)}`);
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({
            message: 'Error al registrar usuario'
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //buscamos por email
        const user = await User.findOne({ email }).select('+password');
        console.log(`Usuario encontrado en login: ${user ? user.email : 'Ninguno'}`);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }
        //comparar contraseñas
        console.log(`Contraseña recibida en login: ${password}`);
        console.log(`Contraseña almacenada en la base de datos: ${user.password}`);

        if (user.password !== password) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            });
        }
        //CREAMOS EL TOKEN
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                _id: user._id,
                email: user.email,
                nombre: user.nombre
            }
        });
        console.log('Usuario autenticado:', user.email);
    } catch (error) {
        console.log(`Error en el inicio de sesión: ${error.message}`);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({
            message: 'Error al obtener usuarios'
        });
    }
}