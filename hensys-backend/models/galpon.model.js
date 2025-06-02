const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM galpon');
  },
  
  getById: async (id) => {
    const [galpon] = await db.query('SELECT * FROM galpon WHERE IdGalpon = ?', [id]);
    return galpon;
  },
  
  create: async (galponData) => {
    const { Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja } = galponData;
    const result = await db.query(
      'INSERT INTO galpon SET ?', 
      { Numero, Tipo, CapacidadMax, Estado, Observaciones, id_Granja }
    );
    return result.insertId;
  },
  
  update: async (id, galponData) => {
    const result = await db.query('UPDATE galpon SET ? WHERE IdGalpon = ?', [galponData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM galpon WHERE IdGalpon = ?', [id]);
    return result.affectedRows;
  }
};