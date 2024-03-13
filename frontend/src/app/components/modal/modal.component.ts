import { Component } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import { FileSizePipe } from "@pipes/file-size/file-size.pipe";
import { FileUploadService } from "@services/file-upload.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    FileSizePipe,
    FormsModule
  ],
  templateUrl: './modal.component.html',
  styles: ``
})
export class ModalComponent {
  file: any | null = null;

  constructor(
    public modalRef: MdbModalRef<ModalComponent>,
    private fileService: FileUploadService
  ) { }

  saveChanges() {
    console.log(this.file)
    this.fileService.updateFile(this.file).subscribe({
      next: (res: any) => {
        console.log(res);
        this.modalRef.close();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    this.modalRef.close();
  }
}
