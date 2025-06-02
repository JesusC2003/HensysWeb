const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animal.controller');

// Rutas CRUD básicas
router.get('/', animalController.getAll);
router.get('/:id', animalController.getById);
router.post('/', animalController.create);
router.put('/:id', animalController.update);
router.delete('/:id', animalController.delete);

// Rutas adicionales
router.get('/lote/:idLote', animalController.getByLote);
router.get('/tipo/:tipo', animalController.getByTipo);

module.exports = router;