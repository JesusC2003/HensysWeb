const animalModel = require('../models/animal.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const animales = await animalModel.getAll();
      res.json(animales);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const animal = await animalModel.getById(req.params.id);
      if (!animal) return res.status(404).json({ error: 'Animal no encontrado' });
      res.json(animal);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica
      if (!req.body.Tipo) {
        return res.status(400).json({ error: 'El tipo de animal es requerido' });
      }
      
      const newId = await animalModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await animalModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Animal no encontrado' });
      res.json({ message: 'Animal actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await animalModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Animal no encontrado' });
      res.json({ message: 'Animal eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  // Controladores adicionales
  getByLote: async (req, res, next) => {
    try {
      const animales = await animalModel.getByLote(req.params.idLote);
      res.json(animales);
    } catch (err) {
      next(err);
    }
  },
  
  getByTipo: async (req, res, next) => {
    try {
      const animales = await animalModel.getByTipo(req.params.tipo);
      res.json(animales);
    } catch (err) {
      next(err);
    }
  }
};