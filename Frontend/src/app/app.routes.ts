import { Routes } from '@angular/router';
import { ListaProductosComponent } from './lista-productos/lista-productos';
import { EditarProductoComponent } from './editar-producto/editar-producto';

export const routes: Routes = [
  { path: '', component: ListaProductosComponent },
  { path: 'editar/:id', component: EditarProductoComponent }
];