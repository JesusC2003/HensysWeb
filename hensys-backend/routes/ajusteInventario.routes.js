const express = require('express');
const router = express.Router();
const ajusteController = require('../controllers/ajusteInventario.controller');

// Rutas CRUD básicas
router.get('/', ajusteController.getAll);
router.get('/:id', ajusteController.getById);
router.post('/', ajusteController.create);
router.put('/:id', ajusteController.update);
router.delete('/:id', ajusteController.delete);

// Ruta adicional para obtener ajustes por producto
router.get('/producto/:idProducto', ajusteController.getByProducto);

module.exports = router;