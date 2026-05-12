const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /categorias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /categorias/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categoria WHERE id=$1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /categorias
router.post('/', async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '')
      return res.status(400).json({ error: 'El nombre es obligatorio' });

    const result = await pool.query(
      'INSERT INTO categoria (nombre) VALUES ($1) RETURNING *', [nombre.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /categorias/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '')
      return res.status(400).json({ error: 'El nombre es obligatorio' });

    const result = await pool.query(
      'UPDATE categoria SET nombre=$1 WHERE id=$2 RETURNING *', [nombre.trim(), id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /categorias/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Verificar si hay productos usando esta categoría
    const productosConCategoria = await pool.query(
      'SELECT COUNT(*) FROM producto WHERE categoria_id=$1', [id]
    );
    if (parseInt(productosConCategoria.rows[0].count) > 0)
      return res.status(400).json({
        error: 'No se puede eliminar. Hay productos asignados a esta categoría.'
      });

    const result = await pool.query(
      'DELETE FROM categoria WHERE id=$1 RETURNING *', [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada', categoria: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
