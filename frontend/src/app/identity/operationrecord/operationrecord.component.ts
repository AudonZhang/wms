import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Inbound } from 'src/app/interfaces/inbound';
import { Outbound } from 'src/app/interfaces/outbound';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-operationrecord',
  templateUrl: './operationrecord.component.html',
  styleUrls: ['./operationrecord.component.css'],
})
export class OperationrecordComponent implements OnInit {
  // student: Student = {studentID: '', studentName: '', studentPassword: '', studentWallet: 0};
  // cancelPermit = 0;  // 撤销预约权限
  // records: Record[] = [];
  selectedOption: string = '入库';
  inbound: Inbound[] = [];
  inboundDisplay: Inbound[] = []; // The list displayed by the search function
  outbound: Outbound[] = [];
  outboundDisplay: Outbound[] = []; // The list displayed by the search function
  visible = false;
  searchValue = '';
  // TransformStringPipe = new TransformStringPipe();  // 寝室号转换管道
  // apartment: string = '';  // 已预约公寓信息
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}
  // // Get user information
  // getUser(): void{
  //   this.userService.getUserById(this.userService.loginID).subscribe(
  //     res => {this.student = res;}
  //   );
  // }

  //Obtain the inbound and outbound records corresponding to the login ID

  inboundSearch(): void {
    this.visible = false;
    this.inboundDisplay = this.inbound.filter(
      (item: Inbound) =>
        item.inboundOrderID.toString().indexOf(this.searchValue) !== -1
    );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示包含入库单ID： ${this.searchValue} 的入库记录!`
      );
    else this.message.create('success', '已重置入库记录！');
  }

  inboundReset(): void {
    // 重置搜索内容
    this.searchValue = '';
    this.inboundSearch();
  }

  outboundSearch(): void {
    this.visible = false;
    this.outboundDisplay = this.outbound.filter(
      (item: Outbound) =>
        item.outboundOrderID.toString().indexOf(this.searchValue) !== -1
    );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示包含出库单ID： ${this.searchValue} 的出库记录!`
      );
    else this.message.create('success', '已重置出库单列表！');
  }

  outboundReset(): void {
    // 重置搜索内容
    this.searchValue = '';
    this.outboundSearch();
  }

  filterRecords(): any[] {
    if (this.selectedOption == '入库') {
      // 当 selectedOption 为 0 时，只展示 status 为 0 的记录
      return this.inboundDisplay;
    } else if (this.selectedOption == '出库') {
      // 当 selectedOption 不为 '入库' 时，返回一个空数组或者其他合适的值
      return this.outboundDisplay;
    } else {
      return [];
    }
  }

  ngOnInit(): void {
    this.userService
      .getInboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.inboundDisplay = res.sort((a: Inbound, b: Inbound) => {
          // 时间近的排在前面
          return (
            new Date(b.inboundCreatedTime).getTime() -
            new Date(a.inboundCreatedTime).getTime()
          );
        });
        this.inbound = this.inboundDisplay;
      });
    this.userService
      .getOutboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.outboundDisplay = res.sort((a: Outbound, b: Outbound) => {
          // 时间近的排在前面
          return (
            new Date(b.outboundCreatedTime).getTime() -
            new Date(a.outboundCreatedTime).getTime()
          );
        });
        this.outbound = this.outboundDisplay;
      });
  }
}
