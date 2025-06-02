const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM cliente');
  },
  
  getById: async (id) => {
    const [cliente] = await db.query('SELECT * FROM cliente WHERE IdCliente = ?', [id]);
    return cliente;
  },
  
  create: async (clienteData) => {
    const { Nombre, Telefono, Email, Direccion, Tipo } = clienteData;
    const result = await db.query(
      'INSERT INTO cliente SET ?', 
      { Nombre, Telefono, Email, Direccion, Tipo }
    );
    return result.insertId;
  },
  
  update: async (id, clienteData) => {
    const result = await db.query('UPDATE cliente SET ? WHERE IdCliente = ?', [clienteData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM cliente WHERE IdCliente = ?', [id]);
    return result.affectedRows;
  }
};