import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log(`connected to the database ${process.env.SQL_DATABASE} successfully`);
});

// creamos el crud para los items
app.post('/items', async (req, res) => {
    const { nombre, descripcion } = req.body;
    console.log('Received data:', { nombre, descripcion });
    
    const query = 'INSERT INTO productos (nombre, descripcion) VALUES (?, ?)';
    db.query(query, [nombre, descripcion], (err, results) => {
        if (err) {
            console.error('Error inserting item:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(201).json({ nombre, descripcion });
    });
})

// para leer los datos
app.get('/items', async (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(200).json(results);
        console.log(`Results: ${results}`);
    });
});

//para buscar un item por id
app.get('/items/:id', async (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM productos WHERE idProductos = ?';
    
    db.query(query, [id], (err, results) => {
        console.log(`Datos obtenidos: ${results[0]}`);
        if (err) {
            console.error('Error fetching item:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json(results[0]);
    });
});

// para  actualizar datos de un item
app.put ('/items/:id', async (req, res) => {
    const { id } =req.params;
    const { nombre, descripcion } = req.body;

    const query = 'UPDATE productos SET nombre = ?, descripcion = ? WHERE idProductos = ?';

    db.query(query, [nombre, descripcion, id], (err, results) => {
        if (err) {
            console.error('Error updating item:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(200).json({ id, nombre, descripcion, message: 'Item updated successfully' });
        console.log(`Item with id ${id} updated successfully`);
    })
})

// para eliminar un item
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM productos WHERE idProductos = ?';
    const guardado = db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json({ message: 'Item deleted successfully' });
        console.log(`Item with id ${id} deleted successfully`);
    });
    console.log(`Query executed: ${guardado}`);
})

app.listen (process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});