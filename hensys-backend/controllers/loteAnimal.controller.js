const loteAnimalModel = require('../models/loteAnimal.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const lotes = await loteAnimalModel.getAll();
      res.json(lotes);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const lote = await loteAnimalModel.getById(req.params.id);
      if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });
      res.json(lote);
    } catch (err) {
      next(err);
    }
  },

  getByGalponId: async (req, res, next) => {
    try {
      const lotes = await loteAnimalModel.getByGalponId(req.params.idGalpon);
      if (lotes.length === 0) return res.status(404).json({ error: 'No se encontraron lotes en este galpón' });
      res.json(lotes);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.NombreLote || !req.body.FechaIngreso || !req.body.IdGalpon) {
        return res.status(400).json({ error: 'NombreLote, FechaIngreso e IdGalpon son campos obligatorios' });
      }
      
      const newId = await loteAnimalModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await loteAnimalModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Lote no encontrado' });
      res.json({ message: 'Lote actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await loteAnimalModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Lote no encontrado' });
      res.json({ message: 'Lote eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};