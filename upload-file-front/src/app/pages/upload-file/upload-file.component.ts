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

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit(){
    console.log(this.uploadForm.value);
    const form = document.getElementById('uploadForm')
    const selectedFile = this.uploadForm.value;

    if (!selectedFile) {
      alert("Debes seleccionar un archivo para cargar.");
    } else {
     

      alert("Cargado");
      this.closeModal();
      this.router.navigate(["show"]);
    }
  }
}
