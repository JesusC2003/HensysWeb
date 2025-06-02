const express = require('express');
const router = express.Router();
const granjaController = require('../controllers/granja.controller');

router.get('/', granjaController.getAll);
router.get('/:id', granjaController.getById);
router.post('/', granjaController.create);
router.put('/:id', granjaController.update);
router.delete('/:id', granjaController.delete);
router.get('/buscar/por-nit/:nit', granjaController.getByNit);

module.exports = router;