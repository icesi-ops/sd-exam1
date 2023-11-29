import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.css'],
})
export class SingleFileUploadComponent implements OnInit {
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial';
  listStatus: 'initial' | 'empty' | 'noEmpty' | 'fail' = 'initial';

  file: File | null = null;

  filesList: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFileList();
  }

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = 'initial';
      this.file = file;
    }
  }


  onUpload() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
  
      this.status = 'uploading';
  
      this.http.post('http://localhost:3500/upload', formData)
        .subscribe({
          next: (response: any) => {
            console.log('Server Response:', response);
            if (response.status === 'success') {
              this.status = 'success';
            } else {
              this.status = 'fail';
            }
          },
          error: (error: any) => {
            console.error(error);
            this.status = 'fail';
          },
        });
    }
    this.getFileList();
  }

  getFileList() {
    // Realiza la solicitud HTTP para obtener la lista de archivos
    this.http.get<string[]>('http://localhost:3500/files')
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            console.log('Server Response:', response);
            this.listStatus = 'noEmpty';
            this.filesList = response.files;
            console.log('FilesList:', this.filesList);
          } else {
            this.listStatus = 'empty';
            this.filesList = [];
          }

        },
        error: (error: any) => {
          console.error(error);
          this.listStatus = 'fail';
        },
      });
  }
  
  
}
