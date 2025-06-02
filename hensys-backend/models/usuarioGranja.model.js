const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM usuario_granja');
  },
  
  getByUsuarioId: async (idUsuario) => {
    return await db.query(`
      SELECT g.* 
      FROM usuario_granja ug
      JOIN granja g ON ug.IdGranja = g.IdGranja
      WHERE ug.IdUsuario = ?
    `, [idUsuario]);
  },

  getByGranjaId: async (idGranja) => {
    return await db.query(`
      SELECT u.* 
      FROM usuario_granja ug
      JOIN usuario u ON ug.IdUsuario = u.IdUsuario
      WHERE ug.IdGranja = ?
    `, [idGranja]);
  },
  
  create: async (relacionData) => {
    const { IdUsuario, IdGranja } = relacionData;
    const result = await db.query(
      'INSERT INTO usuario_granja (IdUsuario, IdGranja) VALUES (?, ?)', 
      [IdUsuario, IdGranja]
    );
    return result;
  },

  delete: async (idUsuario, idGranja) => {
    const result = await db.query(
      'DELETE FROM usuario_granja WHERE IdUsuario = ? AND IdGranja = ?',
      [idUsuario, idGranja]
    );
    return result.affectedRows;
  },

  deleteByUsuarioId: async (idUsuario) => {
    const result = await db.query(
      'DELETE FROM usuario_granja WHERE IdUsuario = ?',
      [idUsuario]
    );
    return result.affectedRows;
  },

  deleteByGranjaId: async (idGranja) => {
    const result = await db.query(
      'DELETE FROM usuario_granja WHERE IdGranja = ?',
      [idGranja]
    );
    return result.affectedRows;
  }
};