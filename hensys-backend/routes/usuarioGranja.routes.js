const express = require('express');
const router = express.Router();
const usuarioGranjaController = require('../controllers/usuarioGranja.controller');

router.get('/', usuarioGranjaController.getAll);
router.get('/usuario/:idUsuario', usuarioGranjaController.getByUsuarioId);
router.get('/granja/:idGranja', usuarioGranjaController.getByGranjaId);
router.post('/', usuarioGranjaController.create);
router.delete('/usuario/:idUsuario/granja/:idGranja', usuarioGranjaController.delete);
router.delete('/usuario/:idUsuario', usuarioGranjaController.deleteByUsuarioId);
router.delete('/granja/:idGranja', usuarioGranjaController.deleteByGranjaId);

module.exports = router;