const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria_nombre
      FROM producto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      ORDER BY p.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /productos/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria_nombre
      FROM producto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /productos
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;
    const result = await pool.query(
      `INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id, imagen)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, stock, categoria_id, imagen]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /productos/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;
    const result = await pool.query(
      `UPDATE producto
       SET nombre=$1, descripcion=$2, precio=$3, stock=$4, categoria_id=$5, imagen=$6
       WHERE id=$7 RETURNING *`,
      [nombre, descripcion, precio, stock, categoria_id, imagen, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /productos/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM producto WHERE id=$1 RETURNING *', [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado', producto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;