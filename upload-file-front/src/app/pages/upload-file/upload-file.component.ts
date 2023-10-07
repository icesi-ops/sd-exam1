import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent { 

  router: Router = inject(Router);
  uploadForm: FormGroup = new FormGroup({
    file: new FormControl('')
  });

  showModal = false;

  constructor(private http: HttpClient) {}

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    console.log(this.uploadForm.value);
  
    // Accede al FormControl 'file'
    const fileControl = this.uploadForm.get('file');
  
    // Verifica si el FormControl tiene un valor y si ese valor no es nulo
    if (fileControl && fileControl.value) {
      const selectedFile = fileControl.value;
  
      // Continúa con el resto de la lógica aquí
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      this.http.post('http://localhost:3500/upload', formData).pipe(
        catchError((error) => {
          console.error("Error al cargar el archivo:", error);
          alert("Error al cargar el archivo. Por favor, inténtalo de nuevo.");
          return of(null);
        })
      ).subscribe((response) => {
        if (response) {
          alert("Archivo cargado con éxito");
          this.closeModal();
          this.router.navigate(["show"]);
        }
      });
    } else {
      alert("Debes seleccionar un archivo para cargar.");
    }
  }
  
}
