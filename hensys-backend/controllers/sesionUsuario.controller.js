const sesionUsuarioModel = require('../models/sesionUsuario.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const sesiones = await sesionUsuarioModel.getAll();
      res.json(sesiones);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const sesion = await sesionUsuarioModel.getById(req.params.id);
      if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
      res.json(sesion);
    } catch (err) {
      next(err);
    }
  },

  getByUsuarioId: async (req, res, next) => {
    try {
      const sesiones = await sesionUsuarioModel.getByUsuarioId(req.params.idUsuario);
      if (sesiones.length === 0) return res.status(404).json({ error: 'No se encontraron sesiones para este usuario' });
      res.json(sesiones);
    } catch (err) {
      next(err);
    }
  },

  getByGranjaId: async (req, res, next) => {
    try {
      const sesiones = await sesionUsuarioModel.getByGranjaId(req.params.idGranja);
      if (sesiones.length === 0) return res.status(404).json({ error: 'No se encontraron sesiones para esta granja' });
      res.json(sesiones);
    } catch (err) {
      next(err);
    }
  },

  getSesionesActivas: async (req, res, next) => {
    try {
      const sesiones = await sesionUsuarioModel.getSesionesActivas(req.params.idUsuario);
      res.json(sesiones);
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
      
      // Establecer HoraInicio al momento actual si no viene en el request
      const sesionData = {
        IdUsuario: req.body.IdUsuario,
        IdGranja: req.body.IdGranja,
        HoraInicio: req.body.HoraInicio || new Date()
      };
      
      const newId = await sesionUsuarioModel.create(sesionData);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },

  cerrarSesion: async (req, res, next) => {
    try {
      const affectedRows = await sesionUsuarioModel.cerrarSesion(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Sesión no encontrada o ya cerrada' });
      res.json({ message: 'Sesión cerrada correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await sesionUsuarioModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Sesión no encontrada' });
      res.json({ message: 'Sesión eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }
};