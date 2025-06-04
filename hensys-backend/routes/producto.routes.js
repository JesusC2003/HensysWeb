const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

// Obtener todos los productos
router.get('/', productoController.getAll);

// Obtener un producto específico
router.get('/:id', productoController.getById);

// Crear un nuevo producto
router.post('/', productoController.create);

// Actualizar un producto
router.put('/:id', productoController.update);

// Eliminar un producto
router.delete('/:id', productoController.delete);

module.exports = router;