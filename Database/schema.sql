CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria_id INT,
  imagen TEXT,
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimiento (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
  cantidad INT NOT NULL,
  stock_anterior INT NOT NULL,
  stock_nuevo INT NOT NULL,
  nota TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES producto(id)
);
