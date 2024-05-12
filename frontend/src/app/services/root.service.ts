import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  private rootUrl = 'http://127.0.0.1:5000/api/root';
  constructor(private http: HttpClient) {}

  // Backup the system database.
  backup() {
    const url = `${this.rootUrl}/backup`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '数据库备份.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('备份失败:', error);
      }
    );
  }
}
