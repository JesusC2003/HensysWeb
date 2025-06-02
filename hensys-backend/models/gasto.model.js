const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM gasto');
  },
  
  getById: async (id) => {
    const [gasto] = await db.query('SELECT * FROM gasto WHERE IdGasto = ?', [id]);
    return gasto;
  },

  getByGranjaId: async (idGranja) => {
    return await db.query('SELECT * FROM gasto WHERE IdGranja = ?', [idGranja]);
  },

  getByCategoria: async (categoria) => {
    return await db.query('SELECT * FROM gasto WHERE Categoria = ?', [categoria]);
  },
  
  create: async (gastoData) => {
    const { Categoria, Monto, Fecha, Descripcion, Responsable, IdGranja } = gastoData;
    const result = await db.query(
      'INSERT INTO gasto SET ?', 
      { Categoria, Monto, Fecha, Descripcion, Responsable, IdGranja }
    );
    return result.insertId;
  },
  
  update: async (id, gastoData) => {
    const result = await db.query('UPDATE gasto SET ? WHERE IdGasto = ?', [gastoData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM gasto WHERE IdGasto = ?', [id]);
    return result.affectedRows;
  }
};