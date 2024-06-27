import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddAuthorComponent } from './components/add-author/add-author.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AutoresComponent } from './components/autores/autores.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { LibrosComponent } from './components/libros/libros.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopHeaderComponent } from './components/top-header/top-header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { HandleErrorDirective } from './directive/handle-error.directive';
import { FormatDateDirective } from './directive/format-date.directive';


@NgModule({
  declarations: [
    AppComponent,
    TopHeaderComponent,
    SidebarComponent,
    DashboardComponent,
    AutoresComponent,
    LibrosComponent,
    AddBookComponent,
    AddAuthorComponent,
    EditBookComponent,
    HandleErrorDirective,
    FormatDateDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgSelectModule,
    MatDialogModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
