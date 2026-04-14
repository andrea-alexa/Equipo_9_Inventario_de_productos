import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen: string;
}

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.css']
})
export class ListaProductosComponent implements OnInit {

  productos: Producto[] = [];

  nuevoNombre: string = '';
  nuevoPrecio: number = 0;
  nuevaDescripcion: string = '';
  nuevoStock: number = 0;
  nuevaCategoria: number = 1;
  nuevaImagen: string = '';

  ngOnInit() {
    const data = localStorage.getItem('productos');
    if (data) {
      this.productos = JSON.parse(data);
    }
  }

  guardarEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  // Agregar producto
  agregarProducto() {
    if (this.nuevoNombre.trim() !== '' && this.nuevoPrecio > 0) {

      const nuevoId = this.productos.length > 0
        ? Math.max(...this.productos.map(p => p.id)) + 1
        : 1;

      this.productos.push({
        id: nuevoId,
        nombre: this.nuevoNombre,
        precio: this.nuevoPrecio,
        descripcion: this.nuevaDescripcion,
        stock: this.nuevoStock,
        categoria_id: this.nuevaCategoria,
        imagen: this.nuevaImagen
      });

      this.guardarEnLocalStorage(); // GUARDAR

      this.nuevoNombre = '';
      this.nuevoPrecio = 0;
      this.nuevaDescripcion = '';
      this.nuevoStock = 0;
      this.nuevaCategoria = 1;
      this.nuevaImagen = '';

    } else {
      alert('Por favor, ingresa un nombre válido y un precio mayor a 0');
    }
  }

  // Eliminar producto
  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.guardarEnLocalStorage(); // GUARDAR
  }
}