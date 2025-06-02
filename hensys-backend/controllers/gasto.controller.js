const gastoModel = require('../models/gasto.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const gastos = await gastoModel.getAll();
      res.json(gastos);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const gasto = await gastoModel.getById(req.params.id);
      if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
      res.json(gasto);
    } catch (err) {
      next(err);
    }
  },

  getByGranjaId: async (req, res, next) => {
    try {
      const gastos = await gastoModel.getByGranjaId(req.params.idGranja);
      if (gastos.length === 0) return res.status(404).json({ error: 'No se encontraron gastos para esta granja' });
      res.json(gastos);
    } catch (err) {
      next(err);
    }
  },

  getByCategoria: async (req, res, next) => {
    try {
      const gastos = await gastoModel.getByCategoria(req.params.categoria);
      if (gastos.length === 0) return res.status(404).json({ error: 'No se encontraron gastos para esta categoría' });
      res.json(gastos);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      const newId = await gastoModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await gastoModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Gasto no encontrado' });
      res.json({ message: 'Gasto actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await gastoModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Gasto no encontrado' });
      res.json({ message: 'Gasto eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};