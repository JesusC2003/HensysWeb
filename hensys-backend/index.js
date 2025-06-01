require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuración CORS específica
const corsOptions = {
  origin: 'http://127.0.0.1:5500', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'Hensys-Admin',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hensys',
  port: process.env.DB_PORT || 3306
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL');
});

app.get('/', (req, res) => {
  res.send('Hensys Backend Funcionando');
});

// Rutas CRUD para galpones

// Obtener todos los galpones
app.get('/galpones', (req, res) => {
  connection.query('SELECT * FROM galpon', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener un galpón específico por ID
app.get('/galpones/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM galpon WHERE IdGalpon = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Galpón no encontrado' });
    res.json(results[0]);
  });
});

// Crear un nuevo galpón
app.post('/galpones', (req, res) => {
  const { Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja } = req.body;
  connection.query(
    'INSERT INTO galpon (Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja) VALUES (?, ?, ?, ?, ?, ?)',
    [Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

// Actualizar un galpón existente
app.put('/galpones/:id', (req, res) => {
  const { id } = req.params;
  const { Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja } = req.body;
  connection.query(
    'UPDATE galpon SET Numero = ?, Tipo = ?, CapacidadMax = ?, Estado = ?, Observaciones = ?, id_Granja = ? WHERE IdGalpon = ?',
    [Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Galpón no encontrado' });
      res.json({ message: 'Galpón actualizado correctamente' });
    }
  );
});

// Eliminar un galpón
app.delete('/galpones/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM galpon WHERE IdGalpon = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Galpón no encontrado' });
    res.json({ message: 'Galpón eliminado correctamente' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});