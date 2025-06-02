const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM detalle_factura');
  },
  
  getById: async (id) => {
    const [detalle] = await db.query('SELECT * FROM detalle_factura WHERE IdDetalle = ?', [id]);
    return detalle;
  },

  getByFacturaId: async (idFactura) => {
    return await db.query('SELECT * FROM detalle_factura WHERE IdFactura = ?', [idFactura]);
  },
  
  create: async (detalleData) => {
    const { IdFactura, IdProducto, Cantidad, PrecioUnitario } = detalleData;
    const result = await db.query(
      'INSERT INTO detalle_factura SET ?', 
      { IdFactura, IdProducto, Cantidad, PrecioUnitario }
    );
    return result.insertId;
  },
  
  update: async (id, detalleData) => {
    const result = await db.query('UPDATE detalle_factura SET ? WHERE IdDetalle = ?', [detalleData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM detalle_factura WHERE IdDetalle = ?', [id]);
    return result.affectedRows;
  }
};