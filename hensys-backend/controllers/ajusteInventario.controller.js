const ajusteModel = require('../models/ajusteInventario.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const ajustes = await ajusteModel.getAll();
      res.json(ajustes);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const ajuste = await ajusteModel.getById(req.params.id);
      if (!ajuste) return res.status(404).json({ error: 'Ajuste no encontrado' });
      res.json(ajuste);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica
      if (!req.body.TipoAjuste || !req.body.Cantidad) {
        return res.status(400).json({ error: 'TipoAjuste y Cantidad son requeridos' });
      }
      
      const newId = await ajusteModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await ajusteModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Ajuste no encontrado' });
      res.json({ message: 'Ajuste actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await ajusteModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Ajuste no encontrado' });
      res.json({ message: 'Ajuste eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  // Controlador adicional para ajustes por producto
  getByProducto: async (req, res, next) => {
    try {
      const ajustes = await ajusteModel.getByProducto(req.params.idProducto);
      res.json(ajustes);
    } catch (err) {
      next(err);
    }
  }
};