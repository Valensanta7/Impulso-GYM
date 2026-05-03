require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db'); // 🧠 Conexión a PostgreSQL

const app = express();

// 🔒 Habilitar CORS y parsear JSON
app.use(cors());
app.use(express.json());

// 🧭 Servir archivos estáticos (como panel.html)
app.use(express.static(path.join(__dirname)));

// 📍 GET — Listar socios desde PostgreSQL
app.get('/api/socios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM socios ORDER BY id_socio');
    res.json(resultado.rows);
  } catch (error) {
    console.error('⛔ Error al obtener socios:', error.message);
    res.status(500).json({ error: 'Error al obtener socios desde la base' });
  }
});

// 📍 POST — Crear nuevo socio en PostgreSQL
app.post('/api/socios', async (req, res) => {
  console.log("🔔 Llegó solicitud POST /api/socios");
  console.log("📦 Body recibido:", req.body);

  const { nombre, apellido, email, telefono, id_tarjeta } = req.body;

  if (!nombre || !apellido || !email || !telefono || !id_tarjeta) {
    console.log("❌ Faltan datos. Rechazando POST.");
    return res.status(400).json({ error: 'Faltan datos del socio' });
  }

  try {
    const query = `
      INSERT INTO socios (nombre, apellido, email, telefono, id_tarjeta)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre, apellido, email, telefono, id_tarjeta];

    const resultado = await pool.query(query, values);
    console.log("✅ Socio creado en la base:", resultado.rows[0]);
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('⛔ Error al crear socio:', error.message);
    res.status(500).json({ error: 'Error al crear socio en la base' });
  }
});

// 📍 DELETE — Eliminar socio en PostgreSQL
app.delete('/api/socios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const resultado = await pool.query('DELETE FROM socios WHERE id_socio = $1 RETURNING *;', [id]);

    if (resultado.rowCount === 0) {
      console.log('❌ Socio no encontrado para eliminar:', id);
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    console.log('🗑️ Socio eliminado de la base:', resultado.rows[0]);
    res.json({ mensaje: 'Socio eliminado' });
  } catch (error) {
    console.error('⛔ Error al eliminar socio:', error.message);
    res.status(500).json({ error: 'Error al eliminar socio desde la base' });
  }
});
// 📍 PUT — Editar socio en PostgreSQL
app.put('/api/socios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, apellido, email, telefono, id_tarjeta } = req.body;

  if (!nombre || !apellido || !email || !telefono || !id_tarjeta) {
    console.log("❌ Datos incompletos para editar");
    return res.status(400).json({ error: 'Faltan datos para editar el socio' });
  }

  try {
    const query = `
      UPDATE socios
      SET nombre = $1, apellido = $2, email = $3, telefono = $4, id_tarjeta = $5
      WHERE id_socio = $6
      RETURNING *;
    `;
    const values = [nombre, apellido, email, telefono, id_tarjeta, id];

    const resultado = await pool.query(query, values);

    if (resultado.rowCount === 0) {
      console.log("❌ Socio no encontrado para editar:", id);
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    console.log("✏️ Socio editado:", resultado.rows[0]);
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("⛔ Error al editar socio:", error.message);
    res.status(500).json({ error: 'Error al editar socio en la base' });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});