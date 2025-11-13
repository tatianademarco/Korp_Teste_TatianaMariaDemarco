import { Routes } from '@angular/router';
import { ProdutosListComponent } from './produtos-list/produtos-list.component';
import { ProdutoFormComponent } from './produto-form/produto-form.component';

export const produtoRoutes: Routes = [
  { path: '', component: ProdutosListComponent },
  { path: 'novo', component: ProdutoFormComponent },
  { path: ':id/editar', component: ProdutoFormComponent },
];
