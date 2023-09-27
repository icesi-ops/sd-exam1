import { Component } from '@angular/core';

interface Archivo {
  name: string;
  size: number;
}

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.css']
})
export class ShowFileComponent {
  displayedColumns: string[] = ['name', 'size', 'actions'];

  fileList: Archivo[] = [
    { name: 'Archivo1', size: 1024 },
    { name: 'Archivo2', size: 2048 },
    // Agrega más objetos según tus datos
  ];

  deleteFile(file: Archivo) {
    // Implementa la lógica para eliminar el archivo aquí
    const index = this.fileList.indexOf(file);
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
  }

  updateFile(file: Archivo) {
    // Implementa la lógica para actualizar el archivo aquí
  }
}
