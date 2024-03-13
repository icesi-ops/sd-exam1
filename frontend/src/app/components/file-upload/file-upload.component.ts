import {Component} from '@angular/core';
import {FileUploadService} from "@services/file-upload.service";
import {Observable} from 'rxjs';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ModalComponent} from "@components/modal/modal.component";

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgForOf,
    AsyncPipe,
    NgOptimizedImage,
    FontAwesomeModule
  ],
  templateUrl: './file-upload.component.html',
  styles: ``,
  providers: [MdbModalService]
})
export class FileUploadComponent {

  modalRef: MdbModalRef<ModalComponent> | null = null;

  faEdit = faEdit;
  faTrash = faTrash;

  selectedFiles?: FileList;
  currentFile?: File;
  progress: number = 0;
  message: string = '';

  fileInfos?: Observable<any>;

  constructor(
    private fileService: FileUploadService,
    private modalService: MdbModalService
  ) { }

  ngOnInit(): void {
    this.fileInfos = this.fileService.getFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  openModal(file: any): void {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: {
        file: file
      },
      modalClass: 'modal-dialog-centered'
    });
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.fileService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / (event.total || 0));
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.fileService.getFiles();
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

  download(filename: string): void {
    this.fileService.downloadFile(filename).subscribe({
        next: (res: any) => {
          console.log(res)
          return URL.createObjectURL(res);
        },
        error: (error: any) => {
          console.log(error);
        }
    });
  }

  delete(file: any): void {
    this.fileService.deleteFile(file).subscribe({
      next: (res: any) => {
        console.log(res);
        this.fileInfos = this.fileService.getFiles();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
