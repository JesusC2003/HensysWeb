const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM granja');
  },
  
  getById: async (id) => {
    const [granja] = await db.query('SELECT * FROM granja WHERE IdGranja = ?', [id]);
    return granja;
  },

  getByNit: async (nit) => {
    const [granja] = await db.query('SELECT * FROM granja WHERE NIT = ?', [nit]);
    return granja;
  },
  
  create: async (granjaData) => {
    const { Nombre, NIT, Ubicacion } = granjaData;
    const result = await db.query(
      'INSERT INTO granja SET ?', 
      { Nombre, NIT, Ubicacion }
    );
    return result.insertId;
  },
  
  update: async (id, granjaData) => {
    const result = await db.query('UPDATE granja SET ? WHERE IdGranja = ?', [granjaData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM granja WHERE IdGranja = ?', [id]);
    return result.affectedRows;
  }
};