const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM sesion_usuario');
  },
  
  getById: async (id) => {
    const [sesion] = await db.query('SELECT * FROM sesion_usuario WHERE IdSesion = ?', [id]);
    return sesion;
  },

  getByUsuarioId: async (idUsuario) => {
    return await db.query('SELECT * FROM sesion_usuario WHERE IdUsuario = ?', [idUsuario]);
  },

  getByGranjaId: async (idGranja) => {
    return await db.query('SELECT * FROM sesion_usuario WHERE IdGranja = ?', [idGranja]);
  },

  getSesionesActivas: async (idUsuario) => {
    return await db.query(
      'SELECT * FROM sesion_usuario WHERE IdUsuario = ? AND HoraFin IS NULL', 
      [idUsuario]
    );
  },
  
  create: async (sesionData) => {
    const { IdUsuario, IdGranja, HoraInicio } = sesionData;
    const result = await db.query(
      'INSERT INTO sesion_usuario SET ?', 
      { IdUsuario, IdGranja, HoraInicio }
    );
    return result.insertId;
  },

  cerrarSesion: async (idSesion) => {
    const result = await db.query(
      'UPDATE sesion_usuario SET HoraFin = NOW() WHERE IdSesion = ? AND HoraFin IS NULL',
      [idSesion]
    );
    return result.affectedRows;
  },
  
  update: async (id, sesionData) => {
    const result = await db.query('UPDATE sesion_usuario SET ? WHERE IdSesion = ?', [sesionData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM sesion_usuario WHERE IdSesion = ?', [id]);
    return result.affectedRows;
  }
};