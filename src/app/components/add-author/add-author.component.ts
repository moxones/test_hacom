import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutorService } from '../../services/autor/autor.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrl: './add-author.component.css'
})
export class AddAuthorComponent {
  authorForm: FormGroup;

  constructor(private fb: FormBuilder, private authorService: AutorService, public dialogRef: MatDialogRef<AddAuthorComponent>) {
    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.authorForm.valid) {
      this.authorService.addAuthor(this.authorForm.value).subscribe(author => {
        this.dialogRef.close(author);
      });
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
