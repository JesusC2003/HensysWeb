// hensys-backend/db/connection.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hensys'
});

connection.connect(error => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL (hensys)');
});

module.exports = connection;
