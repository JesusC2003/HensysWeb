const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gasto.controller');

router.get('/', gastoController.getAll);
router.get('/:id', gastoController.getById);
router.get('/granja/:idGranja', gastoController.getByGranjaId);
router.get('/categoria/:categoria', gastoController.getByCategoria);
router.post('/', gastoController.create);
router.put('/:id', gastoController.update);
router.delete('/:id', gastoController.delete);

module.exports = router;