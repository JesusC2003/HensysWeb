module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({ error: 'Error de configuración de base de datos' });
  }
  
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};