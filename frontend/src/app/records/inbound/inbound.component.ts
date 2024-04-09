import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, tap } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from 'src/app/services/goods.service';
import { RecordService } from 'src/app/services/record.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.component.html',
  styleUrls: ['./inbound.component.css'],
})
export class InboundComponent {
  currentFile?: File;

  public isUpload = false;
  public recordUrl = 'http://127.0.0.1:5000/api/record';

  goods: Goods[] = [];

  constructor(
    private recordService: RecordService,
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService,
    private message: NzMessageService
  ) {}

  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
  }

  uploadConfirm(): void {
    if (this.currentFile) {
      this.uploadFile(this.currentFile).subscribe((res) => {
        this.goods = res;
      });
    }
  }
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

  inboundGoods(): void {
    this.recordService.InboundGoods(this.goods).subscribe();
  }
}
