import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.css'],
})
export class SingleFileUploadComponent {
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial';
  file: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

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
  }
  
  
  







  // onUpload() {
  //   if (this.file) {
  //     const formData = new FormData();

  //     formData.append('file', this.file, this.file.name);

  //     const upload$ = this.http.post('http://localhost:3500/upload', formData);

  //     this.status = 'uploading';

  //     upload$.subscribe({
  //       next: () => {
  //         this.status = 'success';
  //       },
  //       error: (error: any) => {
  //         this.status = 'fail';
  //         return throwError(() => error);
  //       },
  //     });
  //   }
  // }
}
