const express = require('express');
const router = express.Router();
const vacunacionController = require('../controllers/vacunacion.controller');

router.get('/', vacunacionController.getAll);
router.get('/:id', vacunacionController.getById);
router.get('/galpon/:idGalpon', vacunacionController.getByGalponId);
router.get('/fecha/:fecha', vacunacionController.getByDate);
router.post('/', vacunacionController.create);
router.put('/:id', vacunacionController.update);
router.delete('/:id', vacunacionController.delete);

module.exports = router;