import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl: string = 'http://localhost:3000'; // env.SERVER_URL;

  constructor(private http: HttpClient) { }

  public upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  public getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  public downloadFile(fileName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/${fileName}`);
  }

  public deleteFile(file: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/files/${file._id}/${file._rev}`)
  }

  public updateFile(file: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/files`, file)
  }
}
