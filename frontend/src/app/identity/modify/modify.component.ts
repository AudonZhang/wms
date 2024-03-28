import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
})
export class ModifyComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  user: User = {
    userID: '',
    userName: '',
    userGender: '',
    userPasswordMD5: '',
    userPhone: '',
    userEmail: '',
    userRole: '',
    userStatus: '',
    userCreatedByID: '',
    userCreatedTime: '',
  };

  saveConfirm(): void {
    // 确认修改信息
    if (this.user.userName == '' || this.user.userRole == '') {
      // 确认不存在空值
      this.message.create('warning', '字段不符合规定!');
      return;
    }
    this.modal.confirm({
      nzTitle: '<i>确认修改用户信息?</i>',
      nzContent: `<b>姓名:${this.user.userName}</b>
      <b>性别:${this.user.userGender}</b>
      <b>电话:${this.user.userPhone}</b>
      <b>邮箱:${this.user.userEmail}</b>
      <b>职务:${this.user.userRole}</b>`,
      nzOnOk: () => this.save(),
    });
    this.user.userCreatedByID = this.userService.loginID;
  }

  save(): void {
    // 提交修改信息
    this.userService.updateUser(this.user).subscribe(() => this.goBack());
    this.message.info('修改成功!');
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
    this.userService.getUserById(this.userService.modifyID).subscribe((res) => {
      this.user = res;
    });
  }
}
