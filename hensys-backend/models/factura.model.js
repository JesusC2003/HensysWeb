const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM factura');
  },
  
  getById: async (id) => {
    const [factura] = await db.query('SELECT * FROM factura WHERE IdFactura = ?', [id]);
    return factura;
  },

  getByClienteId: async (idCliente) => {
    return await db.query('SELECT * FROM factura WHERE IdCliente = ?', [idCliente]);
  },
  
  create: async (facturaData) => {
    const { Fecha, IdCliente, Total, IdUsuario } = facturaData;
    const result = await db.query(
      'INSERT INTO factura SET ?', 
      { Fecha, IdCliente, Total, IdUsuario }
    );
    return result.insertId;
  },
  
  update: async (id, facturaData) => {
    const result = await db.query('UPDATE factura SET ? WHERE IdFactura = ?', [facturaData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM factura WHERE IdFactura = ?', [id]);
    return result.affectedRows;
  }
};