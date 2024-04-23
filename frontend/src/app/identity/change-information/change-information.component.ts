import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-information',
  templateUrl: './change-information.component.html',
  styleUrls: ['./change-information.component.css'],
})
export class ChangeInformationComponent implements OnInit {
  user: User = {
    userID: '',
    userName: '',
    userGender: '',
    userPasswordMD5: '',
    userPhone: '',
    userEmail: '',
    userRole: '',
    userStatus: '',
    userUpdatedByID: '',
    userUpdatedTime: '',
  };

  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  // 前端输入信息并点击保存后，弹出对话框确认信息
  saveConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>请确认修改后的信息！</i>',
      nzContent: `<p>姓名：${this.user.userName}</p>
        <p>性别：${this.user.userGender}</p>
        <p>电话：${this.user.userPhone}</p>
        <p>邮箱：${this.user.userEmail}</p>`,
      nzOnOk: () => this.save(),
    });
    this.user.userUpdatedByID = this.userService.loginID;
  }

  // 提交修改的信息到后端并返回
  save(): void {
    this.userService.updateUser(this.user).subscribe((res) => {
      if (res == '1') {
        this.message.create('success', '修改成功!');
        this.userService.updateRoot = true; // 更新root页的图表
        this.userService.loginName = this.user.userName;
        this.userService.updateName = true; // 更新屏幕右上角的姓名
      } else {
        this.message.create('error', '未找到用户信息!');
      }
    });
  }

  // 开始时根据正在修改用户ID获取要修改的用户信息
  ngOnInit() {
    this.userService.getUserById(this.userService.loginID).subscribe((res) => {
      this.user = res;
    });
  }
}
