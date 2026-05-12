const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /movimientos - obtener historial completo
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.nombre AS producto_nombre
      FROM movimiento m
      LEFT JOIN producto p ON m.producto_id = p.id
      ORDER BY m.fecha DESC
      LIMIT 200
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /movimientos/producto/:id - historial de un producto
router.get('/producto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT m.*, p.nombre AS producto_nombre
      FROM movimiento m
      LEFT JOIN producto p ON m.producto_id = p.id
      WHERE m.producto_id = $1
      ORDER BY m.fecha DESC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
