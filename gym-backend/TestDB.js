require('dotenv').config(); // ✅ Cargar variables del .env
const pool = require('./db');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('⛔ Error al conectar con la base de datos:', err.message);
  } else {
    console.log('✅ Conexión exitosa. Hora actual del servidor:', res.rows[0].now);
  }
  pool.end();
});
