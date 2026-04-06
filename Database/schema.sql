CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  categoria_id INT,
  imagen TEXT,
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);