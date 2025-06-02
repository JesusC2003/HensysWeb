const usuarioModel = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const usuarios = await usuarioModel.getAll();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },
  
  getById: async (req, res, next) => {
    try {
      const usuario = await usuarioModel.getById(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      // No devolver la contraseña
      const { Contraseña, ...usuarioSinPassword } = usuario;
      res.json(usuarioSinPassword);
    } catch (err) {
      next(err);
    }
  },

  getByIdentificacion: async (req, res, next) => {
    try {
      const usuario = await usuarioModel.getByIdentificacion(req.params.numero);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      const { Contraseña, ...usuarioSinPassword } = usuario;
      res.json(usuarioSinPassword);
    } catch (err) {
      next(err);
    }
  },

  getByRol: async (req, res, next) => {
    try {
      const usuarios = await usuarioModel.getByRol(req.params.rol);
      if (usuarios.length === 0) return res.status(404).json({ error: 'No se encontraron usuarios con este rol' });
      // Eliminar contraseñas de la respuesta
      const usuariosSinPassword = usuarios.map(({ Contraseña, ...rest }) => rest);
      res.json(usuariosSinPassword);
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      // Validación básica de campos requeridos
      if (!req.body.NumeroIdentificacion || !req.body.NombreUsuario || 
          !req.body.Contraseña || !req.body.Email) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto Rol' });
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.Contraseña, salt);

      const usuarioData = {
        ...req.body,
        Contraseña: hashedPassword,
        Rol: req.body.Rol || 'cliente' // Valor por defecto
      };

      const newId = await usuarioModel.create(usuarioData);
      res.status(201).json({ id: newId });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { NombreUsuario, Contraseña } = req.body;
      
      // Buscar usuario
      const usuario = await usuarioModel.getByUsername(NombreUsuario);
      if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

      // Verificar contraseña
      const validPassword = await bcrypt.compare(Contraseña, usuario.Contraseña);
      if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

      // Crear token JWT
      const token = jwt.sign(
        { id: usuario.IdUsuario, rol: usuario.Rol }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8h' }
      );

      // No devolver la contraseña
      const { Contraseña: _, ...usuarioSinPassword } = usuario;

      res.json({
        token,
        usuario: usuarioSinPassword
      });
    } catch (err) {
      next(err);
    }
  },
  
  update: async (req, res, next) => {
    try {
      // Si se está actualizando la contraseña, encriptarla
      if (req.body.Contraseña) {
        const salt = await bcrypt.genSalt(10);
        req.body.Contraseña = await bcrypt.hash(req.body.Contraseña, salt);
      }

      const affectedRows = await usuarioModel.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  
  delete: async (req, res, next) => {
    try {
      const affectedRows = await usuarioModel.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
};