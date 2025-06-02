const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM animal');
  },
  
  getById: async (id) => {
    const [animal] = await db.query('SELECT * FROM animal WHERE IdAnimal = ?', [id]);
    return animal;
  },
  
  create: async (animalData) => {
    const { Tipo, EdadSemanas, PesoPromedio, IdLote } = animalData;
    const result = await db.query(
      'INSERT INTO animal SET ?', 
      { Tipo, EdadSemanas, PesoPromedio, IdLote }
    );
    return result.insertId;
  },
  
  update: async (id, animalData) => {
    const result = await db.query('UPDATE animal SET ? WHERE IdAnimal = ?', [animalData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM animal WHERE IdAnimal = ?', [id]);
    return result.affectedRows;
  },
  
  // Métodos adicionales específicos para animales
  getByLote: async (idLote) => {
    return await db.query('SELECT * FROM animal WHERE IdLote = ?', [idLote]);
  },
  
  getByTipo: async (tipo) => {
    return await db.query('SELECT * FROM animal WHERE Tipo = ?', [tipo]);
  }
};