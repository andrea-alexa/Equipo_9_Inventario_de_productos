import { Component } from '@angular/core';
// 1. Importamos la herramienta de Angular para leer formularios
import { FormsModule } from '@angular/forms'; 

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  // 2. Agregamos FormsModule aquí para poder usarlo en el HTML
  imports: [FormsModule], 
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductosComponent {
  
  // Tu arreglo original (lo dejé vacío para probar el mensaje de advertencia)
  productos: Producto[] = [];

  // 3. Creamos variables temporales para guardar lo que el usuario escriba
  nuevoNombre: string = '';
  nuevoPrecio: number = 0;

  // 4. La función que se ejecuta al darle clic al botón "Agregar"
  agregarProducto() {
    // Verificamos que no nos envíen campos vacíos
    if (this.nuevoNombre.trim() !== '' && this.nuevoPrecio > 0) {
      
      // Calculamos un nuevo ID automático
      const nuevoId = this.productos.length > 0 
        ? Math.max(...this.productos.map(p => p.id)) + 1 
        : 1;

      // Metemos el nuevo producto al arreglo
      this.productos.push({
        id: nuevoId,
        nombre: this.nuevoNombre,
        precio: this.nuevoPrecio
      });

      // Limpiamos las cajas de texto dejándolas como al principio
      this.nuevoNombre = '';
      this.nuevoPrecio = 0;
    } else {
      alert('Por favor, ingresa un nombre válido y un precio mayor a 0');
    }
  }
}