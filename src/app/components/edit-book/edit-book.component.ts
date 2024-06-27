import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../services/autor/autor.service';
import { LibroService } from '../../services/libro/libro.service';
import { Libro } from '../../models/libro';
import { MatDialog } from '@angular/material/dialog';
import { AddAuthorComponent } from '../add-author/add-author.component';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  authors: any[] = [];
  filteredAuthors: any[] = [];
  showSuggestionsList: boolean = false;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: LibroService,
    private authorService: AutorService,
    public dialog: MatDialog
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      authorId: ['', Validators.required],
      authorName: ['', Validators.required],
      published: [false],
      year: [null, [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });
  }

  ngOnInit(): void {
    this.bookForm.get('authorName')?.disable();
    this.authorService.getAuthors().subscribe(data => {
      this.authors = data;
      this.filteredAuthors = data;
      this._onInitNext();
    });
  }

  private _onInitNext() {
    const bookIdParam = this.route.snapshot.paramMap.get('id');
    if (bookIdParam) {
      const bookId = +bookIdParam;
      this.bookService.getLibroById(bookId).subscribe(
        book => {
          this.bookForm.patchValue({
            title: book.title,
            description: book.description,
            authorId: book.author,
            authorName: this.getAuthorNameById(book.author),
            published: book.published,
            year: book.year
          });
        },
        error => {
          this.errorMessage = 'Libro no encontrado';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'ID de libro no válido';
    }
  }

  onAuthorInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredAuthors = this.authors.filter(author => author.name.toLowerCase().includes(input));
    this.showSuggestionsList = true;
  }

  selectAuthor(author: any): void {
    this.bookForm.patchValue({ authorId: author.id, authorName: author.name });
    this.filteredAuthors = [];
    this.showSuggestionsList = false;
  }

  showSuggestions(): void {
    this.showSuggestionsList = true;
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestionsList = false;
    }, 200);
  }

  openAddAuthorDialog(): void {
    const dialogRef = this.dialog.open(AddAuthorComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authorService.getAuthors().subscribe(data => {
          this.authors = data;
          this.filteredAuthors = data;
          this.bookForm.patchValue({ authorId: result.id, authorName: result.name });
        });
      }
    });
  }


  onSubmit(): void {
    const bookIdParam = this.route.snapshot.paramMap.get('id');
    if (bookIdParam && this.bookForm.valid) {
      const updatedBook: Libro = new Libro(
        +bookIdParam,
        this.bookForm.value.title,
        this.bookForm.value.description,
        this.bookForm.value.authorId,
        this.bookForm.value.published,
        this.bookForm.value.year,
        new Date()
      );

      this.bookService.updateLibro(updatedBook).subscribe(() => {
        this.router.navigate(['/libros']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/libros']);
  }

  goBack(): void {
    this.router.navigate(['/libros']);
  }
  private getAuthorNameById(id: number): string {
    const author = this.authors.find(a => +a.id === +id);
    return author ? author.name : '';
  }
}
