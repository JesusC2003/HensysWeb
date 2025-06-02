const granjaModel = require('../models/granja.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const granjas = await granjaModel.getAll();
      res.json(granjas);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const granja = await granjaModel.getById(req.params.id);
      if (!granja) return res.status(404).json({ error: 'Granja no encontrada' });
      res.json(granja);
    } catch (err) {
      next(err);
    }
  },

  getByNit: async (req, res, next) => {
    try {
      const granja = await granjaModel.getByNit(req.params.nit);
      if (!granja) return res.status(404).json({ error: 'No se encontró granja con este NIT' });
      res.json(granja);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.Nombre || !req.body.NIT) {
        return res.status(400).json({ error: 'Nombre y NIT son campos obligatorios' });
      }
      
      const newId = await granjaModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await granjaModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Granja no encontrada' });
      res.json({ message: 'Granja actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await granjaModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Granja no encontrada' });
      res.json({ message: 'Granja eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }
};