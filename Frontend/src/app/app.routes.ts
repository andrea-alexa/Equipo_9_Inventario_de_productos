import { Routes } from '@angular/router';

import { EditarProductoComponent } from './editar-producto/editar-producto'; 

export const routes: Routes = [

  { path: 'editar/:id', component: EditarProductoComponent }
];