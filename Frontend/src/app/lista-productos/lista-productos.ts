import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [RouterLink, FormsModule],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.css']
})

@Component({
  selector: 'app-lista-productos',
  standalone: true,

  imports: [FormsModule], 
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductosComponent {
  

  productos: Producto[] = [];


  nuevoNombre: string = '';
  nuevoPrecio: number = 0;


  agregarProducto() {

    if (this.nuevoNombre.trim() !== '' && this.nuevoPrecio > 0) {
      
      // Calculamos un nuevo ID automático
      const nuevoId = this.productos.length > 0 
        ? Math.max(...this.productos.map(p => p.id)) + 1 
        : 1;


this.productos.push({
  id: nuevoId,
  nombre: this.nuevoNombre,
  precio: this.nuevoPrecio,
  descripcion: '',
  stock: 0,       
  categoria_id: 1, 
  imagen: ''       
});

      this.nuevoNombre = '';
      this.nuevoPrecio = 0;
    } else {
      alert('Por favor, ingresa un nombre válido y un precio mayor a 0');
    }
  }
}