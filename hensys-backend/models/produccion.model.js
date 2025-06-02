const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM produccion');
  },
  
  getById: async (id) => {
    const [produccion] = await db.query('SELECT * FROM produccion WHERE IdProduccion = ?', [id]);
    return produccion;
  },

  getByGalponId: async (idGalpon) => {
    return await db.query('SELECT * FROM produccion WHERE IdGalpon = ?', [idGalpon]);
  },

  getByProductoId: async (idProducto) => {
    return await db.query('SELECT * FROM produccion WHERE IdProducto = ?', [idProducto]);
  },

  getByDate: async (fecha) => {
    return await db.query('SELECT * FROM produccion WHERE Fecha = ?', [fecha]);
  },
  
  create: async (produccionData) => {
    const { Fecha, IdGalpon, IdProducto, CantidadProduccion, Observaciones } = produccionData;
    const result = await db.query(
      'INSERT INTO produccion SET ?', 
      { Fecha, IdGalpon, IdProducto, CantidadProduccion, Observaciones }
    );
    return result.insertId;
  },
  
  update: async (id, produccionData) => {
    const result = await db.query('UPDATE produccion SET ? WHERE IdProduccion = ?', [produccionData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM produccion WHERE IdProduccion = ?', [id]);
    return result.affectedRows;
  }
};