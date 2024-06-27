import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LibroService } from '../../services/libro/libro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent {
  books: any[] = [];
  filteredBooks: any[] = [];
  paginatedBooks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  searchText: string = '';

  constructor(private bookService: LibroService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      this.filteredBooks = this.books;
      this.totalPages = Math.ceil(this.filteredBooks.length / this.itemsPerPage);
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.paginateBooks();
    });
  }

  filterBooks(): void {
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      book.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
      book.authorName.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(1); // Reiniciar a la primera pagina
  }

  paginateBooks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateBooks();
    }
  }

  editBook(id: number): void {
    this.router.navigate(['/edit-book', id]);
  }

  deleteBook(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.deleteLibro(id).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El libro ha sido eliminado.',
            'success'
          );
          this.loadBooks();
        });
      }
    });
  }
}
