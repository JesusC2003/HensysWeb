const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

router.get('/', facturaController.getAll);
router.get('/:id', facturaController.getById);
router.get('/cliente/:idCliente', facturaController.getByClienteId);
router.post('/', facturaController.create);
router.put('/:id', facturaController.update);
router.delete('/:id', facturaController.delete);

module.exports = router;