const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');

router.get('/', inventarioController.getAll);
router.get('/:id', inventarioController.getById);
router.get('/producto/:idProducto', inventarioController.getByProductoId);
router.post('/', inventarioController.create);
router.put('/:id', inventarioController.update);
router.put('/producto/:idProducto', inventarioController.updateByProductoId);
router.delete('/:id', inventarioController.delete);

module.exports = router;