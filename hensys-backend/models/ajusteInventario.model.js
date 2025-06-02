const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM ajuste_inventario');
  },
  
  getById: async (id) => {
    const [ajuste] = await db.query('SELECT * FROM ajuste_inventario WHERE IdAjuste = ?', [id]);
    return ajuste;
  },
  
  create: async (ajusteData) => {
    const { IdProducto, TipoAjuste, Cantidad, Fecha, Motivo } = ajusteData;
    const result = await db.query(
      'INSERT INTO ajuste_inventario SET ?', 
      { IdProducto, TipoAjuste, Cantidad, Fecha, Motivo }
    );
    return result.insertId;
  },
  
  update: async (id, ajusteData) => {
    const result = await db.query('UPDATE ajuste_inventario SET ? WHERE IdAjuste = ?', [ajusteData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM ajuste_inventario WHERE IdAjuste = ?', [id]);
    return result.affectedRows;
  },
  
  // Método adicional específico para ajustes
  getByProducto: async (idProducto) => {
    return await db.query('SELECT * FROM ajuste_inventario WHERE IdProducto = ?', [idProducto]);
  }
};