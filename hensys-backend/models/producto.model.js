const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM producto');
  },
  
  getById: async (id) => {
    const [producto] = await db.query('SELECT * FROM producto WHERE IdProducto = ?', [id]);
    return producto;
  },
  
  create: async (productoData) => {
    const { Nombre, Tipo, Unidad } = productoData;
    const result = await db.query(
      'INSERT INTO producto SET ?', 
      { Nombre, Tipo, Unidad }
    );
    return result.insertId;
  },
  
  update: async (id, productoData) => {
    const result = await db.query('UPDATE producto SET ? WHERE IdProducto = ?', [productoData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM producto WHERE IdProducto = ?', [id]);
    return result.affectedRows;
  }
};