const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM lote_animal');
  },
  
  getById: async (id) => {
    const [lote] = await db.query('SELECT * FROM lote_animal WHERE IdLote = ?', [id]);
    return lote;
  },

  getByGalponId: async (idGalpon) => {
    return await db.query('SELECT * FROM lote_animal WHERE IdGalpon = ?', [idGalpon]);
  },
  
  create: async (loteData) => {
    const { NombreLote, FechaIngreso, IdGalpon } = loteData;
    const result = await db.query(
      'INSERT INTO lote_animal SET ?', 
      { NombreLote, FechaIngreso, IdGalpon }
    );
    return result.insertId;
  },
  
  update: async (id, loteData) => {
    const result = await db.query('UPDATE lote_animal SET ? WHERE IdLote = ?', [loteData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM lote_animal WHERE IdLote = ?', [id]);
    return result.affectedRows;
  }
};