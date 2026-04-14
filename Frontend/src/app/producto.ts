import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
 id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen: string;

}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  //  Cambien esta url cuando finalmente agreguen productos en backend, seria tipo http://localhost:3000/productos, algo asi )
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  // con esto vamos a llamar un producto por ID
  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // Aca se puede actualiuzar
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }
}
