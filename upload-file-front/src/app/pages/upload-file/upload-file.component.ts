import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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

  showModal = false; // Variable para controlar la visibilidad del modal

  // Función para abrir el modal
  openModal() {
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal() {
    this.showModal = false;
  }

  onSubmit(){
    console.log(this.uploadForm.value);
    if (this.uploadForm.value.file === '') {
      alert("Archivo vacío");
    } else {
      alert("Cargado");
      this.closeModal(); // Cierra el modal después de cargar
      this.router.navigate(["show"]);
    }
  }

}
