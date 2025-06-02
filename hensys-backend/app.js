require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors.config');
const errorHandler = require('./middlewares/errorHandler');
const galponRoutes = require('./routes/galpon.routes');
const ajusteRoutes = require('./routes/ajusteInventario.routes');
const animalRoutes = require('./routes/animal.routes');
const clienteRoutes = require('./routes/cliente.routes');
const detalleFacturaRoutes = require('./routes/detalleFactura.routes');
const facturaRoutes = require('./routes/factura.routes');
const gastoRoutes = require('./routes/gasto.routes');
const granjaRoutes = require('./routes/granja.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const loteAnimalRoutes = require('./routes/loteAnimal.routes');
const produccionRoutes = require('./routes/produccion.routes');
const sesionUsuarioRoutes = require('./routes/sesionUsuario.routes');
const usuarioRoutes = require('./routes/usuario.routes'); 
const usuarioGranjaRoutes = require('./routes/usuarioGranja.routes'); 
const vacunacionRoutes = require('./routes/vacunacion.routes');
const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(express.json());

// Rutas
app.get('/', (req, res) => res.send('Hensys Backend Funcionando'));
app.use('/galpones', galponRoutes);
app.use('/ajustes-inventario', ajusteRoutes);
app.use('/animales', animalRoutes);
app.use('/clientes', clienteRoutes);
app.use('/detalle-factura', detalleFacturaRoutes);
app.use('/facturas', facturaRoutes);
app.use('/gastos', gastoRoutes);
app.use('/granjas', granjaRoutes);
app.use('/inventarios', inventarioRoutes);
app.use('/lotes-animales', loteAnimalRoutes);
app.use('/producciones', produccionRoutes);
app.use('/sesiones-usuario', sesionUsuarioRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/usuarios-granja', usuarioGranjaRoutes);
app.use('/vacunaciones', vacunacionRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});