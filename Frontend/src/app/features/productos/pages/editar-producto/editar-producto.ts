import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../../features/productos/services/producto';
import { CategoriaService, Categoria } from '../../../../features/categorias/services/categoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './editar-producto.html',
  styleUrls: ['./editar-producto.css']
})
export class EditarProductoComponent implements OnInit {

  productoForm: FormGroup;
  productoId!: number;
  categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria_id: [1, Validators.required],
      imagen: ['']
    });
  }

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));

    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
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

    this.productoService.obtenerProducto(this.productoId).subscribe({
      next: (producto) => {
        this.productoForm.patchValue(producto);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el producto',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  guardarCambios(): void {
    if (this.productoForm.valid) {
      this.productoService.actualizarProducto(this.productoId, this.productoForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Producto actualizado!',
            text: 'Los cambios se guardaron correctamente',
            background: '#1a1d27',
            color: '#e2e8f0',
            confirmButtonColor: '#6366f1',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/productos']);
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el producto',
            background: '#1a1d27',
            color: '#e2e8f0',
            confirmButtonColor: '#6366f1'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos',
        background: '#1a1d27',
        color: '#e2e8f0',
        confirmButtonColor: '#6366f1'
      });
    }
  }
}