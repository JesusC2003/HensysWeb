const facturaModel = require('../models/factura.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const facturas = await facturaModel.getAll();
      res.json(facturas);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const factura = await facturaModel.getById(req.params.id);
      if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
      res.json(factura);
    } catch (err) {
      next(err);
    }
  },

  getByClienteId: async (req, res, next) => {
    try {
      const facturas = await facturaModel.getByClienteId(req.params.idCliente);
      if (facturas.length === 0) return res.status(404).json({ error: 'No se encontraron facturas para este cliente' });
      res.json(facturas);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Calcular el total si no viene en el request
      if (!req.body.Total) {
        req.body.Total = 0; // Puedes implementar lógica para calcularlo basado en los detalles
      }
      
      const newId = await facturaModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await facturaModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Factura no encontrada' });
      res.json({ message: 'Factura actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await facturaModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Factura no encontrada' });
      res.json({ message: 'Factura eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }
};