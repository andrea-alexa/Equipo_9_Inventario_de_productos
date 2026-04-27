import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../../features/productos/services/producto';
import { CategoriaService, Categoria } from '../../../../features/categorias/services/categoria';

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

    this.categoriaService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

    this.productoService.obtenerProducto(this.productoId).subscribe(producto => {
      this.productoForm.patchValue(producto);
    });
  }

  guardarCambios(): void {
    if (this.productoForm.valid) {
      this.productoService.actualizarProducto(this.productoId, this.productoForm.value).subscribe(() => {
        alert('Producto actualizado correctamente');
        this.router.navigate(['/productos']);
      });
    }
  }
}