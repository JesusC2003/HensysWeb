const produccionModel = require('../models/produccion.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const producciones = await produccionModel.getAll();
      res.json(producciones);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const produccion = await produccionModel.getById(req.params.id);
      if (!produccion) return res.status(404).json({ error: 'Registro de producción no encontrado' });
      res.json(produccion);
    } catch (err) {
      next(err);
    }
  },

  getByGalponId: async (req, res, next) => {
    try {
      const producciones = await produccionModel.getByGalponId(req.params.idGalpon);
      if (producciones.length === 0) return res.status(404).json({ error: 'No se encontraron registros para este galpón' });
      res.json(producciones);
    } catch (err) {
      next(err);
    }
  },

  getByProductoId: async (req, res, next) => {
    try {
      const producciones = await produccionModel.getByProductoId(req.params.idProducto);
      if (producciones.length === 0) return res.status(404).json({ error: 'No se encontraron registros para este producto' });
      res.json(producciones);
    } catch (err) {
      next(err);
    }
  },

  getByDate: async (req, res, next) => {
    try {
      const producciones = await produccionModel.getByDate(req.params.fecha);
      if (producciones.length === 0) return res.status(404).json({ error: 'No se encontraron registros para esta fecha' });
      res.json(producciones);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.Fecha || !req.body.IdGalpon || !req.body.IdProducto || req.body.CantidadProduccion === undefined) {
        return res.status(400).json({ error: 'Fecha, IdGalpon, IdProducto y CantidadProduccion son campos obligatorios' });
      }
      
      const newId = await produccionModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await produccionModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Registro de producción no encontrado' });
      res.json({ message: 'Producción actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await produccionModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Registro de producción no encontrado' });
      res.json({ message: 'Producción eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }
};