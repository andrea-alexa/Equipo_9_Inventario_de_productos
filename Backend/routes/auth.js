const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el email ya existe
    const existe = await pool.query('SELECT * FROM usuario WHERE email=$1', [email]);
    if (existe.rows.length > 0)
      return res.status(400).json({ error: 'El email ya está registrado' });

    // Encriptar la contraseña
    const passwordEncriptada = await bcrypt.hash(password, 10);

    // Insertar el usuario
    const result = await pool.query(
      'INSERT INTO usuario (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, passwordEncriptada]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario
    const result = await pool.query('SELECT * FROM usuario WHERE email=$1', [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const usuario = result.rows[0];

    // Verificar la contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    // Generar el token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ mensaje: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;