import { Routes } from '@angular/router';
import { NotasListComponent } from './notas-list/notas-list.component';
import { NotaFormComponent } from './nota-form/nota-form.component';

export const notaRoutes: Routes = [
  { path: '', component: NotasListComponent },
  { path: 'nova', component: NotaFormComponent },
  { path: ':id/editar', component: NotaFormComponent },
];
