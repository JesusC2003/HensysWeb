// hensys-backend/index.js
const express = require('express');
const cors = require('cors'); // ⬅️ Importar cors
const connection = require('./db/connection');

const app = express();
const PORT = 3000;

// ⬅️ Habilitar CORS para todas las rutas
app.use(cors());

app.get('/galpones', (req, res) => {
  connection.query('SELECT * FROM galpon', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error al obtener galpones' });
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
