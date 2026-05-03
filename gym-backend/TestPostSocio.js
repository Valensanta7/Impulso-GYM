const axios = require('axios');

// 🧾 Datos del nuevo socio
const nuevoSocio = {
  nombre: "Laura",
  apellido: "Pérez",
  email: "laura@example.com",
  telefono: "1155551234",
  id_tarjeta: 2  // Asegurate que esta tarjeta exista en la tabla 'Tarjetas'
};

// 📬 Enviar solicitud POST al backend
axios.post('http://localhost:3000/api/socios', nuevoSocio)
  .then(response => {
    console.log('✅ Socio creado:', response.data);
  })
  .catch(error => {
    if (error.response && error.response.data) {
      console.log("⛔ Error al crear socio:", error.response.data);
    } else {
      console.log("⛔ Error inesperado:", error.message);
    }
  });
