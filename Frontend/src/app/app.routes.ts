import { Routes } from '@angular/router';
import { ListaProductosComponent } from './features/productos/pages/lista-productos/lista-productos';
import { EditarProductoComponent } from './features/productos/pages/editar-producto/editar-producto';
import { ListaCategoriasComponent } from './features/categorias/pages/lista-categorias';
import { HistorialComponent } from './features/historial/pages/historial';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'productos', component: ListaProductosComponent, canActivate: [authGuard] },
  { path: 'editar/:id', component: EditarProductoComponent, canActivate: [authGuard] },
  { path: 'categorias', component: ListaCategoriasComponent, canActivate: [authGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard] }
];
