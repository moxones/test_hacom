import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutorService } from '../../services/autor/autor.service';
import { LibroService } from '../../services/libro/libro.service';
import { SharedService } from '../../services/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAuthorComponent } from '../add-author/add-author.component';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  bookForm: FormGroup;
  authors: any[] = [];
  filteredAuthors: any[] = [];
  showSuggestionsList: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bookService: LibroService,
    private authorService: AutorService,
    private sharedService: SharedService,
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
    this.authorService.getAuthors().subscribe(data => {
      this.authors = data;
      this.filteredAuthors = data;

      // Verificar si hay un nuevo autor agregado
      this.sharedService.getNewAuthor().subscribe(newAuthor => {
        if (newAuthor && newAuthor.id) {
          this.bookForm.patchValue({ authorId: newAuthor.id, authorName: newAuthor.name });
          this.sharedService.clearNewAuthor();
        }
      });

      // Cargar los datos del formulario si existen
      this.sharedService.getFormData().subscribe(data => {
        if (data) {
          this.bookForm.patchValue(data);
        }
      });
    });
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.showSuggestionsList = false;
    }
  }

  showSuggestions(): void {
    this.showSuggestionsList = true;
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestionsList = false;
    }, 200);
  }


  onSubmit(): void {
    if (this.bookForm.valid) {
      const newBook = {
        title: this.bookForm.value.title,
        description: this.bookForm.value.description,
        author: this.bookForm.value.authorId,
        published: this.bookForm.value.published,
        year: this.bookForm.value.year,
        id: Date.now(),
        registrationDate: new Date()
      };

      this.bookService.addLibro(newBook).subscribe(() => {
        this.router.navigate(['/libros']);
      });
    }
  }

  openAuthorModal(): void {
    this.sharedService.setFormData(this.bookForm.value);
    this.router.navigate(['/add-author']);
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

  cancel(): void {
    this.router.navigate(['/libros']);
  }

  goBack(): void {
    this.router.navigate(['/libros']);
  }
}
