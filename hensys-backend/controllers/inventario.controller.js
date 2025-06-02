const inventarioModel = require('../models/inventario.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const inventarios = await inventarioModel.getAll();
      res.json(inventarios);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const inventario = await inventarioModel.getById(req.params.id);
      if (!inventario) return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      res.json(inventario);
    } catch (err) {
      next(err);
    }
  },

  getByProductoId: async (req, res, next) => {
    try {
      const inventario = await inventarioModel.getByProductoId(req.params.idProducto);
      if (!inventario) return res.status(404).json({ error: 'No se encontró inventario para este producto' });
      res.json(inventario);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.IdProducto || req.body.CantidadDisponible === undefined) {
        return res.status(400).json({ error: 'IdProducto y CantidadDisponible son campos obligatorios' });
      }
      
      const newId = await inventarioModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await inventarioModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      res.json({ message: 'Inventario actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },

  updateByProductoId: async (req, res, next) => {
    try {
      const affectedRows = await inventarioModel.updateByProductoId(req.params.idProducto, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'No se encontró inventario para este producto' });
      res.json({ message: 'Inventario actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await inventarioModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      res.json({ message: 'Inventario eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};