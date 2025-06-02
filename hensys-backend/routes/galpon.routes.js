const express = require('express');
const router = express.Router();
const galponController = require('../controllers/galpon.controller');

router.get('/', galponController.getAll);
router.get('/:id', galponController.getById);
router.post('/', galponController.create);
router.put('/:id', galponController.update);
router.delete('/:id', galponController.delete);

module.exports = router;