import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService, Producto } from '../../../../features/productos/services/producto';
import { CategoriaService, Categoria } from '../../../../features/categorias/services/categoria';
import Swal from 'sweetalert2';

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

  categoriaSeleccionada: number = 0;
  soloStockBajo: boolean = false;

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
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los productos',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
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

  agregarProducto(): void {
    if (this.nuevoNombre.trim() === '' || this.nuevoPrecio <= 0 || this.nuevaCategoria === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor ingresa un nombre, precio mayor a 0 y selecciona una categoría',
        background: '#1a1d27',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    const nuevo = {
      nombre: this.nuevoNombre,
      descripcion: this.nuevaDescripcion,
      precio: this.nuevoPrecio,
      stock: this.nuevoStock,
      categoria_id: this.nuevaCategoria,
      imagen: this.nuevaImagen
    };

    this.productoService.crearProducto(nuevo).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Producto agregado!',
          text: 'El producto se agregó correctamente',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1',
          timer: 2000,
          showConfirmButton: false
        });
        this.cargarProductos();
        this.nuevoNombre = '';
        this.nuevoPrecio = 0;
        this.nuevaDescripcion = '';
        this.nuevoStock = 0;
        this.nuevaCategoria = 0;
        this.nuevaImagen = '';
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el producto',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const porCategoria = this.categoriaSeleccionada == 0 || p.categoria_id == this.categoriaSeleccionada;
      const porStock = !this.soloStockBajo || p.stock < 5;
      return porCategoria && porStock;
    });
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
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
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El producto fue eliminado correctamente',
              background: '#1a1d27',
              color: '#e2e8f0',
              confirmButtonColor: '#6366f1',
              timer: 2000,
              showConfirmButton: false
            });
            this.cargarProductos();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el producto',
              background: '#1a1d27',
              color: '#e2e8f0',
              confirmButtonColor: '#6366f1'
            });
          }
        });
      }
    });
  }

  actualizarStock(id: number, tipo: string): void {
    Swal.fire({
      title: tipo === 'entrada' ? '▲ Entrada de stock' : '▼ Salida de stock',
      html: `
        <div style="text-align: left; margin-bottom: 12px;">
          <label style="color: #a0aec0; font-size: 0.875rem; display: block; margin-bottom: 4px;">Cantidad</label>
          <input id="swal-cantidad" type="number" min="1" step="1" value="1"
            class="swal2-input" style="margin: 0; width: 100%;">
        </div>
        <div style="text-align: left;">
          <label style="color: #a0aec0; font-size: 0.875rem; display: block; margin-bottom: 4px;">Nota (opcional)</label>
          <input id="swal-nota" type="text" placeholder="Ej: Compra a proveedor, Venta cliente..."
            class="swal2-input" style="margin: 0; width: 100%;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      background: '#1a1d27',
      color: '#e2e8f0',
      confirmButtonColor: tipo === 'entrada' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#2d3148',
      preConfirm: () => {
        const cantidad = Number((document.getElementById('swal-cantidad') as HTMLInputElement).value);
        const nota = (document.getElementById('swal-nota') as HTMLInputElement).value;
        if (!cantidad || cantidad <= 0) {
          Swal.showValidationMessage('Ingresa una cantidad mayor a 0');
          return false;
        }
        return { cantidad, nota };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { cantidad, nota } = result.value;

        this.productoService.actualizarStock(id, cantidad, tipo, nota).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: tipo === 'entrada' ? '¡Stock agregado!' : '¡Stock reducido!',
              text: `Se ${tipo === 'entrada' ? 'agregaron' : 'redujeron'} ${cantidad} unidades`,
              background: '#1a1d27',
              color: '#e2e8f0',
              confirmButtonColor: '#6366f1',
              timer: 2000,
              showConfirmButton: false
            });
            this.cargarProductos();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.error || 'No se pudo actualizar el stock',
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
