import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AutoresComponent } from './components/autores/autores.component';
import { LibrosComponent } from './components/libros/libros.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AddAuthorComponent } from './components/add-author/add-author.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'autores', component: AutoresComponent },
  { path: 'libros', component: LibrosComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'add-author', component: AddAuthorComponent },
  { path: 'edit-book/:id', component: EditBookComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
