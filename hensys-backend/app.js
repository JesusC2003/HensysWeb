require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors.config');
const errorHandler = require('./middlewares/errorHandler');
const galponRoutes = require('./routes/galpon.routes');
const ajusteRoutes = require('./routes/ajusteInventario.routes');
const animalRoutes = require('./routes/animal.routes');

const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(express.json());

// Rutas
app.get('/', (req, res) => res.send('Hensys Backend Funcionando'));
app.use('/galpones', galponRoutes);
app.use('/ajustes-inventario', ajusteRoutes);
app.use('/animales', animalRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});