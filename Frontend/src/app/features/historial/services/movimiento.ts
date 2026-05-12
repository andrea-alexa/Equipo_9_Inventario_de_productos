import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimiento {
  id: number;
  producto_id: number;
  producto_nombre: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  nota: string | null;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = 'https://inventario-backend-3q1w.onrender.com/movimientos';

  constructor(private http: HttpClient) {}

  obtenerMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl);
  }

  obtenerMovimientosPorProducto(productoId: number): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.apiUrl}/producto/${productoId}`);
  }
}
