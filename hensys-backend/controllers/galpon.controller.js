const galponModel = require('../models/galpon.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const galpones = await galponModel.getAll();
      res.json(galpones);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const galpon = await galponModel.getById(req.params.id);
      if (!galpon) return res.status(404).json({ error: 'Galpón no encontrado' });
      res.json(galpon);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      const newId = await galponModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await galponModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Galpón no encontrado' });
      res.json({ message: 'Galpón actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await galponModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Galpón no encontrado' });
      res.json({ message: 'Galpón eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};