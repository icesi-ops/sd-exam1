import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../utils/config';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = Config.URL_DEL_ENDPOINT_DE_CARGA;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData);
  }
}
