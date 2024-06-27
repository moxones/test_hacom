import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private apiUrl = 'http://localhost:3000/authors';

  constructor(private http: HttpClient) { }

  addAuthor(author: any): Observable<any> {
    return this.http.post(this.apiUrl, author);
  }

  getAuthors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  updateAuthor(id: number, author: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  searchAuthors(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?name_like=${term}`).pipe(
      map(authors => authors || [])
    );
  }
}
