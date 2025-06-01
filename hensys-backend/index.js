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
app.get('/galpones', (req, res) => {
  connection.query('SELECT * FROM galpon', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/galpones', (req, res) => {
  const { Numero, Tipo, CapacidadMax, Estado, Observaciones, IdGranja } = req.body;
  connection.query(
    'INSERT INTO galpon (Numero, Tipo, CapacidadMax, Estado, Observaciones, IdGranja) VALUES (?, ?, ?, ?, ?, ?)',
    [Numero, Tipo, CapacidadMax, Estado, Observaciones, IdGranja],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

