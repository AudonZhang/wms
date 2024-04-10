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
  currentFile?: File; // 文件选择

  public isUpload = false; // 是否上传文件
  public recordUrl = 'http://127.0.0.1:5000/api/record';

  goods: Goods[] = []; // 储存上传的货物信息

  constructor(
    private recordService: RecordService,
    private http: HttpClient,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  // 选择文件
  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
  }

  // 实现上传货物信息确认功能
  uploadConfirm(): void {
    if (this.currentFile) {
      this.uploadFile(this.currentFile).subscribe((res) => {
        this.goods = res;
      });
    }
  }

  // 将上传的文件与用户ID传到后端
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

  // 信息确认后，将入库货物信息发到后端
  inboundGoods(): void {
    this.recordService.InboundGoods(this.goods).subscribe();
    this.message.create('success', '入库成功!');
    this.goods = [];
    this.currentFile = undefined;
  }
}
