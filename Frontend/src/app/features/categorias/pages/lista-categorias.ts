import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../services/categoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-categorias.html',
  styleUrls: ['./lista-categorias.css']
})
export class ListaCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  nuevoNombre: string = '';
  editandoId: number | null = null;
  editandoNombre: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  agregarCategoria(): void {
    if (this.nuevoNombre.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Ingresa un nombre para la categoría',
        background: '#1a1d27',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    this.categoriaService.crearCategoria({ nombre: this.nuevoNombre.trim() }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Categoría creada!',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1',
          timer: 1500,
          showConfirmButton: false
        });
        this.nuevoNombre = '';
        this.cargarCategorias();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la categoría',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  iniciarEdicion(cat: Categoria): void {
    this.editandoId = cat.id;
    this.editandoNombre = cat.nombre;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editandoNombre = '';
  }

  guardarEdicion(id: number): void {
    if (this.editandoNombre.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre no puede estar vacío',
        background: '#1a1d27',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    this.categoriaService.actualizarCategoria(id, { nombre: this.editandoNombre.trim() }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Categoría actualizada!',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1',
          timer: 1500,
          showConfirmButton: false
        });
        this.editandoId = null;
        this.editandoNombre = '';
        this.cargarCategorias();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la categoría',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'No se puede eliminar si tiene productos asignados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1d27',
      color: '#e2e8f0',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2d3148'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminada!',
              background: '#1a1d27',
              color: '#e2e8f0',
              confirmButtonColor: '#6366f1',
              timer: 1500,
              showConfirmButton: false
            });
            this.cargarCategorias();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo eliminar',
              text: err.error?.error || 'Error al eliminar la categoría',
              background: '#1a1d27',
              color: '#e2e8f0',
              confirmButtonColor: '#6366f1'
            });
          }
        });
      }
    });
  }
}
