import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Libro } from '../../models/libro';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = 'http://localhost:3000/books';
  private authorsUrl = 'http://localhost:3000/authors';

  constructor(private http: HttpClient) { }

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  
  getBooks(): Observable<any[]> {
    return forkJoin([this.http.get<any[]>(this.apiUrl), this.http.get<any[]>(this.authorsUrl)]).pipe(
      map(([books, authors]) => {
        return books.map(book => {
          const author = authors.find(a => +a.id === +book.author);
          return { ...book, authorName: author ? author.name : 'Desconocido' };
        });
      })
    );
  }

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro).pipe(
      catchError(this.handleError)
    );
  }

  updateLibro(libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${libro.id}`, libro).pipe(
      catchError(this.handleError)
    );
  }

  deleteLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ocurrió un error: ${error.error.message}`;
    } else {
      errorMessage = `Server retorno el código: ${error.status}, con el mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
