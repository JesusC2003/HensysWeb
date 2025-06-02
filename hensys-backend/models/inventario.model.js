const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM inventario');
  },
  
  getById: async (id) => {
    const [inventario] = await db.query('SELECT * FROM inventario WHERE IdInventario = ?', [id]);
    return inventario;
  },

  getByProductoId: async (idProducto) => {
    const [inventario] = await db.query('SELECT * FROM inventario WHERE IdProducto = ?', [idProducto]);
    return inventario;
  },
  
  create: async (inventarioData) => {
    const { IdProducto, CantidadDisponible } = inventarioData;
    const result = await db.query(
      'INSERT INTO inventario SET ?', 
      { IdProducto, CantidadDisponible }
    );
    return result.insertId;
  },
  
  update: async (id, inventarioData) => {
    const result = await db.query('UPDATE inventario SET ? WHERE IdInventario = ?', [inventarioData, id]);
    return result.affectedRows;
  },

  updateByProductoId: async (idProducto, inventarioData) => {
    const result = await db.query('UPDATE inventario SET ? WHERE IdProducto = ?', [inventarioData, idProducto]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM inventario WHERE IdInventario = ?', [id]);
    return result.affectedRows;
  }
};