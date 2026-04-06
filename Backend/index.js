const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());


app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});