const detalleFacturaModel = require('../models/detalleFactura.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const detalles = await detalleFacturaModel.getAll();
      res.json(detalles);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const detalle = await detalleFacturaModel.getById(req.params.id);
      if (!detalle) return res.status(404).json({ error: 'Detalle de factura no encontrado' });
      res.json(detalle);
    } catch (err) {
      next(err);
    }
  },

  getByFacturaId: async (req, res, next) => {
    try {
      const detalles = await detalleFacturaModel.getByFacturaId(req.params.idFactura);
      if (detalles.length === 0) return res.status(404).json({ error: 'No se encontraron detalles para esta factura' });
      res.json(detalles);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      const newId = await detalleFacturaModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await detalleFacturaModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Detalle de factura no encontrado' });
      res.json({ message: 'Detalle de factura actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await detalleFacturaModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Detalle de factura no encontrado' });
      res.json({ message: 'Detalle de factura eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};