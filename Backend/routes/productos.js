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

    // Registrar movimiento inicial si hay stock
    if (stock > 0) {
      await pool.query(
        `INSERT INTO movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, nota)
         VALUES ($1, 'entrada', $2, 0, $2, 'Stock inicial al crear producto')`,
        [result.rows[0].id, stock]
      );
    }

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
    // Eliminar movimientos asociados primero
    await pool.query('DELETE FROM movimiento WHERE producto_id=$1', [id]);
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

// PATCH /productos/:id/stock - entrada o salida de stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, tipo, nota } = req.body; // tipo: 'entrada' o 'salida'

    const producto = await pool.query('SELECT * FROM producto WHERE id=$1', [id]);
    if (producto.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });

    const stockAnterior = producto.rows[0].stock;
    let nuevoStock = stockAnterior;

    if (tipo === 'entrada') {
      nuevoStock += cantidad;
    } else if (tipo === 'salida') {
      if (stockAnterior < cantidad)
        return res.status(400).json({ error: 'Stock insuficiente' });
      nuevoStock -= cantidad;
    } else {
      return res.status(400).json({ error: 'Tipo inválido. Use "entrada" o "salida"' });
    }

    const result = await pool.query(
      'UPDATE producto SET stock=$1 WHERE id=$2 RETURNING *',
      [nuevoStock, id]
    );

    // Registrar en historial
    await pool.query(
      `INSERT INTO movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, nota)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, tipo, cantidad, stockAnterior, nuevoStock, nota || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
