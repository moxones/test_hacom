import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    private formData = new BehaviorSubject<any>(null);
    private newAuthor = new BehaviorSubject<any>(null);
  
    setFormData(data: any): void {
      this.formData.next(data);
    }
  
    getFormData() {
      return this.formData.asObservable();
    }
  
    setNewAuthor(author: any): void {
      this.newAuthor.next(author);
    }
  
    getNewAuthor() {
      return this.newAuthor.asObservable();
    }
  
    clearNewAuthor(): void {
      this.newAuthor.next(null);
    }
}
