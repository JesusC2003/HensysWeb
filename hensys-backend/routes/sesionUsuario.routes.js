const express = require('express');
const router = express.Router();
const sesionUsuarioController = require('../controllers/sesionUsuario.controller');

router.get('/', sesionUsuarioController.getAll);
router.get('/:id', sesionUsuarioController.getById);
router.get('/usuario/:idUsuario', sesionUsuarioController.getByUsuarioId);
router.get('/granja/:idGranja', sesionUsuarioController.getByGranjaId);
router.get('/activas/:idUsuario', sesionUsuarioController.getSesionesActivas);
router.post('/', sesionUsuarioController.create);
router.put('/:id/cerrar', sesionUsuarioController.cerrarSesion);
router.delete('/:id', sesionUsuarioController.delete);

module.exports = router;