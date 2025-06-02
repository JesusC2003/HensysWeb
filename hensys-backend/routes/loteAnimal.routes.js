const express = require('express');
const router = express.Router();
const loteAnimalController = require('../controllers/loteAnimal.controller');

router.get('/', loteAnimalController.getAll);
router.get('/:id', loteAnimalController.getById);
router.get('/galpon/:idGalpon', loteAnimalController.getByGalponId);
router.post('/', loteAnimalController.create);
router.put('/:id', loteAnimalController.update);
router.delete('/:id', loteAnimalController.delete);

module.exports = router;