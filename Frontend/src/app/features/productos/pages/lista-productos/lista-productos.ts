import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService, Producto } from '../../../../features/productos/services/producto';
import { CategoriaService, Categoria } from '../../../../features/categorias/services/categoria';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.css']
})
export class ListaProductosComponent implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  nuevoNombre: string = '';
  nuevoPrecio: number = 0;
  nuevaDescripcion: string = '';
  nuevoStock: number = 0;
  nuevaCategoria: number = 0;
  nuevaImagen: string = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productos = productos;
      this.cdr.detectChanges();
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
      this.cdr.detectChanges();
    });
  }

  agregarProducto(): void {
    if (this.nuevoNombre.trim() !== '' && this.nuevoPrecio > 0) {
      const nuevo = {
        nombre: this.nuevoNombre,
        descripcion: this.nuevaDescripcion,
        precio: this.nuevoPrecio,
        stock: this.nuevoStock,
        categoria_id: this.nuevaCategoria,
        imagen: this.nuevaImagen
      };

      this.productoService.crearProducto(nuevo).subscribe(() => {
        this.cargarProductos();
        this.nuevoNombre = '';
        this.nuevoPrecio = 0;
        this.nuevaDescripcion = '';
        this.nuevoStock = 0;
        this.nuevaCategoria = 0;
        this.nuevaImagen = '';
      });

    } else {
      alert('Por favor ingresa un nombre válido y un precio mayor a 0');
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}