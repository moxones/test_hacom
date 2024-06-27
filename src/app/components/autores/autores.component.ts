import { Component } from '@angular/core';
import { AutorService } from '../../services/autor/autor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAuthorComponent } from '../add-author/add-author.component';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrl: './autores.component.css'
})
export class AutoresComponent {
  authors: any[] = [];
  errorMessage: string | null = null;

  constructor(private authorService: AutorService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors(): void {
    this.authorService.getAuthors().subscribe(
      authors => {
        this.authors = authors;
      },
      error => {
        this.errorMessage = 'Error al cargar los autores';
        console.error(error);
      }
    );
  }

  openAddAuthorDialog(): void {
    const dialogRef = this.dialog.open(AddAuthorComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAuthors();
      }
    });
  }

  deleteAuthor(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este autor?')) {
      this.authorService.deleteAuthor(id).subscribe(() => {
        this.getAuthors();
      });
    }
  }
}
