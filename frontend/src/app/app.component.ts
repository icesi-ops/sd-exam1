import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgForOf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  files: File[] = [];
  selectedFile: File | null = null;

  async ngOnInit()  {
    const response: Response = await fetch('http://localhost:3000/', {
      method: 'GET',
    })
    console.log(response);
    console.log('init');
  }

  async uploadFile(): Promise<void> {
    if (this.selectedFile) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
      };
      reader.readAsDataURL(this.selectedFile);

      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      console.log(formData.get('file'))
      console.log('Uploading file');
      const response: Response = await fetch('http://localhost:3000/files', {
        method: 'POST',
        body: reader.result
      })

      console.log(response);

      this.files.push(this.selectedFile);
    }
  }

  onFileSelected(event: Event) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    const files: FileList | null = element.files;
    if (!files)
      return;
    const file: File = files[0];
    console.log(file);
    this.selectedFile = file;
  }
}
