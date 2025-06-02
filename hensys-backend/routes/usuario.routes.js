const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.get('/identificacion/:numero', usuarioController.getByIdentificacion);
router.get('/rol/:rol', usuarioController.getByRol);
router.post('/', usuarioController.create);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);
router.post('/login', usuarioController.login);

module.exports = router;