const productoModel = require('../models/producto.model');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const productos = await productoModel.getAll();
      res.json(productos);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const producto = await productoModel.getById(req.params.id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(producto);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      const { Nombre, Tipo, Unidad } = req.body;
      
      // Validar campos requeridos
      if (!Nombre || !Tipo || !Unidad) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos',
          detalles: {
            Nombre: 'Debe proporcionar un nombre para el producto',
            Tipo: 'Debe ser uno de: Huevos, Carne, Gallina',
            Unidad: 'Debe ser uno de: Kg, Docena, Unidad'
          }
        });
      }

      // Validar valores enum
      const tiposValidos = ['Huevos', 'Carne', 'Gallina'];
      const unidadesValidas = ['Kg', 'Docena', 'Unidad'];
      
      if (!tiposValidos.includes(Tipo)) {
        return res.status(400).json({ 
          error: 'Tipo de producto no válido',
          valores_aceptados: tiposValidos
        });
      }

      if (!unidadesValidas.includes(Unidad)) {
        return res.status(400).json({ 
          error: 'Unidad de medida no válida',
          valores_aceptados: unidadesValidas
        });
      }
      
      const newId = await productoModel.create(req.body);
      res.status(201).json({ 
        message: 'Producto creado correctamente',
        id: newId
      });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      const affectedRows = await productoModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await productoModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};