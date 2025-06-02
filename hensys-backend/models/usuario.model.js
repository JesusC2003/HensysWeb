const db = require('../services/db.service');

module.exports = {
  getAll: async () => {
    return await db.query('SELECT * FROM usuario');
  },
  
  getById: async (id) => {
    const [usuario] = await db.query('SELECT * FROM usuario WHERE IdUsuario = ?', [id]);
    return usuario;
  },

  getByIdentificacion: async (numero) => {
    const [usuario] = await db.query('SELECT * FROM usuario WHERE NumeroIdentificacion = ?', [numero]);
    return usuario;
  },

  getByUsername: async (nombreUsuario) => {
    const [usuario] = await db.query('SELECT * FROM usuario WHERE NombreUsuario = ?', [nombreUsuario]);
    return usuario;
  },

  getByRol: async (rol) => {
    return await db.query('SELECT * FROM usuario WHERE Rol = ?', [rol]);
  },
  
  create: async (usuarioData) => {
    const { NumeroIdentificacion, NombreUsuario, Contraseña, Email, Rol } = usuarioData;
    const result = await db.query(
      'INSERT INTO usuario SET ?', 
      { NumeroIdentificacion, NombreUsuario, Contraseña, Email, Rol }
    );
    return result.insertId;
  },
  
  update: async (id, usuarioData) => {
    const result = await db.query('UPDATE usuario SET ? WHERE IdUsuario = ?', [usuarioData, id]);
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const result = await db.query('DELETE FROM usuario WHERE IdUsuario = ?', [id]);
    return result.affectedRows;
  }
};