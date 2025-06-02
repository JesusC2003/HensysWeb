const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM vacunacion');
  },
  
  getById: async (id) => {
    const [vacunacion] = await db.query('SELECT * FROM vacunacion WHERE IdVacunacion = ?', [id]);
    return vacunacion;
  },

  getByGalponId: async (idGalpon) => {
    return await db.query('SELECT * FROM vacunacion WHERE id_Galpon = ?', [idGalpon]);
  },

  getByDate: async (fecha) => {
    return await db.query('SELECT * FROM vacunacion WHERE Fecha = ?', [fecha]);
  },
  
  create: async (vacunacionData) => {
    const { TipoVacuna, CantidadAves, Fecha, Responsable, Observaciones, id_Galpon } = vacunacionData;
    const result = await db.query(
      'INSERT INTO vacunacion SET ?', 
      { TipoVacuna, CantidadAves, Fecha, Responsable, Observaciones, id_Galpon }
    );
    return result.insertId;
  },
  
  update: async (id, vacunacionData) => {
    const result = await db.query('UPDATE vacunacion SET ? WHERE IdVacunacion = ?', [vacunacionData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM vacunacion WHERE IdVacunacion = ?', [id]);
    return result.affectedRows;
  }
};