const express = require('express');
const router = express.Router();
const detalleFacturaController = require('../controllers/detalleFactura.controller');

router.get('/', detalleFacturaController.getAll);
router.get('/:id', detalleFacturaController.getById);
router.get('/factura/:idFactura', detalleFacturaController.getByFacturaId);
router.post('/', detalleFacturaController.create);
router.put('/:id', detalleFacturaController.update);
router.delete('/:id', detalleFacturaController.delete);

module.exports = router;