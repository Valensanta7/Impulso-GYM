const axios = require('axios');
axios.delete('http://localhost:3000/api/socios/2')
  .then(res => {
    console.log('✅ Socio eliminado:', res.data);
  })
  .catch(err => {
    console.error('⛔ Error al eliminar socio COMPLETO:\n', err.toJSON?.() || err);
  });