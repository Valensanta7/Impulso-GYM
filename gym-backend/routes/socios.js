const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📬 Log básico para debug
router.use((req, res, next) => {
  console.log(`📬 ${req.method} ${req.originalUrl}`);
  next();
});

// 🔍 Obtener todos los socios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM socios');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener socios:', err.message);
    res.status(500).json({ error: 'Error al obtener socios' });
  }
});

// 🆕 Crear nuevo socio con validación mejorada
router.post('/', async (req, res) => {
  const { nombre, apellido, email, telefono, id_tarjeta } = req.body;

  // Validación básica en backend
  if (!nombre || !apellido || !email || !telefono || !id_tarjeta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const verificar = await pool.query(
      'SELECT id_tarjeta FROM tarjetas WHERE id_tarjeta = $1',
      [id_tarjeta]
    );

    if (verificar.rowCount === 0) {
      return res.status(400).json({ error: 'ID tarjeta no existe. No se puede crear socio.' });
    }

    const result = await pool.query(
      `INSERT INTO socios (nombre, apellido, email, telefono, id_tarjeta)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, apellido, email, telefono, id_tarjeta]
    );

    res.status(201).json({
      mensaje: 'Socio creado exitosamente',
      socio: result.rows[0]
    });
  } catch (err) {
    console.error('🔥 Error al crear socio:', err.message);
    res.status(500).json({ error: 'Error interno al crear socio' });
  }
});

// 📝 Actualizar socio
router.put('/:id_socio', async (req, res) => {
  const { id_socio } = req.params;
  const { nombre, apellido, email, telefono, id_tarjeta } = req.body;

  if (!nombre || !apellido || !email || !telefono || !id_tarjeta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const verificar = await pool.query(
      'SELECT id_tarjeta FROM tarjetas WHERE id_tarjeta = $1',
      [id_tarjeta]
    );

    if (verificar.rowCount === 0) {
      return res.status(400).json({ error: 'ID tarjeta no válida. No se puede actualizar.' });
    }

    const result = await pool.query(
      `UPDATE socios SET
        nombre = $1,
        apellido = $2,
        email = $3,
        telefono = $4,
        id_tarjeta = $5
       WHERE id_socio = $6
       RETURNING *`,
      [nombre, apellido, email, telefono, id_tarjeta, id_socio]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.json({ mensaje: 'Socio actualizado correctamente', socio: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar socio:', err.message);
    res.status(500).json({ error: 'Error interno al actualizar socio' });
  }
});

// 🗑️ Eliminar socio
router.delete('/:id_socio', async (req, res) => {
  const { id_socio } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM socios WHERE id_socio = $1 RETURNING *',
      [id_socio]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Socio no encontrado para eliminar' });
    }

    res.json({ mensaje: 'Socio eliminado correctamente', socio: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al eliminar socio:', err.message);
    res.status(500).json({ error: 'Error interno al eliminar socio' });
  }
});

// 🔎 Obtener socio por ID
router.get('/:id_socio', async (req, res) => {
  const { id_socio } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM socios WHERE id_socio = $1',
      [id_socio]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al buscar socio:', err.message);
    res.status(500).json({ error: 'Error interno al buscar socio' });
  }
});

module.exports = router;