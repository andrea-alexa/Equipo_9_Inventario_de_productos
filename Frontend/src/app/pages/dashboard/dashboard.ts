import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../features/productos/services/producto';
import { CategoriaService } from '../../features/categorias/services/categoria';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalProductos: number = 0;
  totalCategorias: number = 0;
  stockBajo: number = 0;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.totalProductos = productos.length;
      this.stockBajo = productos.filter(p => p.stock < 5).length;
      this.cdr.detectChanges();
    });

    this.categoriaService.obtenerCategorias().subscribe(categorias => {
      this.totalCategorias = categorias.length;
      this.cdr.detectChanges();
    });
  }
}