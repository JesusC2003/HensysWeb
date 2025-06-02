const vacunacionModel = require('../models/vacunacion.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const vacunaciones = await vacunacionModel.getAll();
      res.json(vacunaciones);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const vacunacion = await vacunacionModel.getById(req.params.id);
      if (!vacunacion) return res.status(404).json({ error: 'Registro de vacunación no encontrado' });
      res.json(vacunacion);
    } catch (err) {
      next(err);
    }
  },

  getByGalponId: async (req, res, next) => {
    try {
      const vacunaciones = await vacunacionModel.getByGalponId(req.params.idGalpon);
      if (vacunaciones.length === 0) return res.status(404).json({ error: 'No se encontraron vacunaciones para este galpón' });
      res.json(vacunaciones);
    } catch (err) {
      next(err);
    }
  },

  getByDate: async (req, res, next) => {
    try {
      const vacunaciones = await vacunacionModel.getByDate(req.params.fecha);
      if (vacunaciones.length === 0) return res.status(404).json({ error: 'No se encontraron vacunaciones para esta fecha' });
      res.json(vacunaciones);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.TipoVacuna || !req.body.id_Galpon) {
        return res.status(400).json({ error: 'TipoVacuna e id_Galpon son campos obligatorios' });
      }
      
      const newId = await vacunacionModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await vacunacionModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Registro de vacunación no encontrado' });
      res.json({ message: 'Vacunación actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await vacunacionModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Registro de vacunación no encontrado' });
      res.json({ message: 'Vacunación eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }
};