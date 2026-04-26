const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/productos', productosRoutes);
app.use('/categorias', categoriasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Inventario funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});