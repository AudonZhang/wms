import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, tap } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { RecordService } from 'src/app/services/record.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.component.html',
  styleUrls: ['./inbound.component.css'],
})
export class InboundComponent {
  currentFile?: File; // Store uploaded files

  public isUpload = false; // Submit files to the backend？
  public recordUrl = 'http://127.0.0.1:5000/api/record';

  goods: Goods[] = []; // Store uploaded goods information

  constructor(
    private recordService: RecordService,
    private http: HttpClient,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  // Select files and upload to Angular
  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
  }

  // Confirm upload file content
  uploadConfirm(): void {
    if (this.currentFile) {
      this.uploadFile(this.currentFile).subscribe((res) => {
        this.goods = res;
      });
    }
  }

  // Send the file to Flask to read its content and receive the result returned by Flask
  uploadFile(file: File): Observable<any> {
    const url = `${this.recordUrl}/inboundConfirm`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userID', this.userService.loginID);
    this.isUpload = true;
    return this.http
      .post<any>(url, formData)
      .pipe(tap((_) => console.log(`增加了ID为上传入库单`)));
  }

  // After confirming the information, send the inbound information to Flask
  inboundGoods(): void {
    this.recordService.InboundGoods(this.goods).subscribe();
    this.message.create('success', '入库成功!');
    this.goods = [];
    this.currentFile = undefined;
    this.recordService.afterModifyChart = true;
  }
}
