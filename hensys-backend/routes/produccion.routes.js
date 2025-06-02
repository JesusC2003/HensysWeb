const express = require('express');
const router = express.Router();
const produccionController = require('../controllers/produccion.controller');

router.get('/', produccionController.getAll);
router.get('/:id', produccionController.getById);
router.get('/galpon/:idGalpon', produccionController.getByGalponId);
router.get('/producto/:idProducto', produccionController.getByProductoId);
router.get('/fecha/:fecha', produccionController.getByDate);
router.post('/', produccionController.create);
router.put('/:id', produccionController.update);
router.delete('/:id', produccionController.delete);

module.exports = router;