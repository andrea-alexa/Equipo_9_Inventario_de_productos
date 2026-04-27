import { Routes } from '@angular/router';
import { ListaProductosComponent } from './features/productos/pages/lista-productos/lista-productos';
import { EditarProductoComponent } from './features/productos/pages/editar-producto/editar-producto';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'productos', component: ListaProductosComponent },
  { path: 'editar/:id', component: EditarProductoComponent }
];