import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './editar-producto.html',
  styleUrls: ['./editar-producto.css']
})
export class EditarProductoComponent implements OnInit {

  productoForm: FormGroup;
  productoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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

    const data = localStorage.getItem('productos');
    if (data) {
      const productos = JSON.parse(data);
      const producto = productos.find((p: any) => p.id === this.productoId);

      if (producto) {
        this.productoForm.patchValue(producto);
      }
    }
  }

  guardarCambios(): void {
    if (this.productoForm.valid) {

      const data = localStorage.getItem('productos');
      if (data) {
        let productos = JSON.parse(data);

        productos = productos.map((p: any) =>
          p.id === this.productoId
            ? { ...p, ...this.productoForm.value }
            : p
        );

        localStorage.setItem('productos', JSON.stringify(productos));
      }

      alert('Producto actualizado correctamente');
      this.router.navigate(['/']);
    }
  }
}