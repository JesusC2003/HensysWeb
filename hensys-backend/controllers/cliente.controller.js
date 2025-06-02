const clienteModel = require('../models/cliente.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const clientes = await clienteModel.getAll();
      res.json(clientes);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const cliente = await clienteModel.getById(req.params.id);
      if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(cliente);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      const newId = await clienteModel.create(req.body);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await clienteModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json({ message: 'Cliente actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await clienteModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};