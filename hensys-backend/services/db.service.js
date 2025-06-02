const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

module.exports = {
  query: async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  
  getConnection: async () => {
    return await pool.getConnection();
  }
};