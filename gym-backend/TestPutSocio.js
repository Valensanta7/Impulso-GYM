const axios = require('axios');
axios.put('http://localhost:3000/api/socios/3', {
  nombre: "Laura",
  apellido: "Castro",
  email: "laura@example.com",
  telefono: "2262584412",
  id_tarjeta: 2 
})
.then(res => {
  console.log('✅ Socio actualizado:', res.data);
})
.catch(err => {
  const error = err.response?.data || err.message;
  console.error('⛔ Error al actualizar socio:', error);
});