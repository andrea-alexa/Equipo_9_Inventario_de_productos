import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../producto'; 

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './editar-producto.html', 
  styleUrls: ['./editar-producto.css']   
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  productoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
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

    if (this.productoId) {
      this.productoService.obtenerProducto(this.productoId).subscribe({
        next: (producto) => {

          this.productoForm.patchValue({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            categoria_id: producto.categoria_id,
            imagen: producto.imagen
          });
        },
        error: (err) => console.error('Error al cargar el producto', err)
      });
    }
  }

  guardarCambios(): void {
    if (this.productoForm.valid) {
      this.productoService.actualizarProducto(this.productoId, this.productoForm.value)
        .subscribe({
          next: () => {
            alert('Producto actualizado correctamente');
          
            this.router.navigate(['/']); 
          },
          error: (err) => console.error('Error al guardar', err)
        });
    }
  }
}