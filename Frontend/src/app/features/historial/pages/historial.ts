import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoService, Movimiento } from '../../historial/services/movimiento';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  movimientos: Movimiento[] = [];
  filtroTipo: string = 'todos';
  busqueda: string = '';

  constructor(
    private movimientoService: MovimientoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.movimientoService.obtenerMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos = movimientos;
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el historial de movimientos',
          background: '#1a1d27',
          color: '#e2e8f0',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  get movimientosFiltrados(): Movimiento[] {
    return this.movimientos.filter(m => {
      const coincideTipo = this.filtroTipo === 'todos' || m.tipo === this.filtroTipo;
      const coincideBusqueda = this.busqueda.trim() === '' ||
        m.producto_nombre?.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideTipo && coincideBusqueda;
    });
  }

  get totalEntradas(): number {
    return this.movimientos.filter(m => m.tipo === 'entrada').length;
  }

  get totalSalidas(): number {
    return this.movimientos.filter(m => m.tipo === 'salida').length;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
