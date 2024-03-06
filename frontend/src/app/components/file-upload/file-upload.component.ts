import {Component} from '@angular/core';
import {FileUploadService} from "@services/file-upload.service";
import {Observable} from 'rxjs';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './file-upload.component.html',
  styles: ``
})
export class FileUploadComponent {

  selectedFiles?: FileList;
  currentFile?: File;
  progress: number = 0;
  message: string = '';

  fileInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / (event.total || 0));
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error) {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
}
