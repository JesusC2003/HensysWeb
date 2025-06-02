const usuarioGranjaModel = require('../models/usuarioGranja.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const relaciones = await usuarioGranjaModel.getAll();
      res.json(relaciones);
    } catch (err) {
      next(err);
    }
  },
  
  getByUsuarioId: async (req, res, next) => {
    try {
      const granjas = await usuarioGranjaModel.getByUsuarioId(req.params.idUsuario);
      if (granjas.length === 0) return res.status(404).json({ error: 'No se encontraron granjas para este usuario' });
      res.json(granjas);
    } catch (err) {
      next(err);
    }
  },

  getByGranjaId: async (req, res, next) => {
    try {
      const usuarios = await usuarioGranjaModel.getByGranjaId(req.params.idGranja);
      if (usuarios.length === 0) return res.status(404).json({ error: 'No se encontraron usuarios para esta granja' });
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.IdUsuario || !req.body.IdGranja) {
        return res.status(400).json({ error: 'IdUsuario e IdGranja son campos obligatorios' });
      }
      
      const result = await usuarioGranjaModel.create(req.body);
      res.status(201).json({ message: 'Relación usuario-granja creada correctamente' });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const affectedRows = await usuarioGranjaModel.delete(req.params.idUsuario, req.params.idGranja);
      if (affectedRows === 0) return res.status(404).json({ error: 'Relación no encontrada' });
      res.json({ message: 'Relación usuario-granja eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  },

  deleteByUsuarioId: async (req, res, next) => {
    try {
      const affectedRows = await usuarioGranjaModel.deleteByUsuarioId(req.params.idUsuario);
      if (affectedRows === 0) return res.status(404).json({ error: 'No se encontraron relaciones para este usuario' });
      res.json({ message: 'Todas las relaciones del usuario eliminadas correctamente' });
    } catch (err) {
      next(err);
    }
  },

  deleteByGranjaId: async (req, res, next) => {
    try {
      const affectedRows = await usuarioGranjaModel.deleteByGranjaId(req.params.idGranja);
      if (affectedRows === 0) return res.status(404).json({ error: 'No se encontraron relaciones para esta granja' });
      res.json({ message: 'Todas las relaciones de la granja eliminadas correctamente' });
    } catch (err) {
      next(err);
    }
  }
};