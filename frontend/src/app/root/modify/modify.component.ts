import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
})
export class ModifyComponent implements OnInit {
  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router
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
    userUpdatedByID: '',
    userUpdatedTime: '',
  };

  // 前端输入信息并点击保存后，弹出对话框确认信息
  saveConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>请确认用户修改后的信息！</i>',
      nzContent: `<p>姓名：${this.user.userName}</p>
      <p>性别：${this.user.userGender}</p>
      <p>电话：${this.user.userPhone}</p>
      <p>邮箱：${this.user.userEmail}</p>
      <p>职务：${this.user.userRole}</p>`,
      nzOnOk: () => this.save(),
    });
    this.user.userUpdatedByID = this.userService.loginID;
  }

  // 提交修改的信息到后端并返回
  save(): void {
    this.userService.updateUser(this.user).subscribe(() => this.goBack());
    this.message.create('success', '修改成功!');
  }

  // 修改后返回到用户信息页
  goBack(): void {
    this.router.navigateByUrl('/index/root/allUsers');
    this.userService.modifyID = ''; // 修改完成后清除
    this.userService.afterModify = true; // 修改完成后在用户信息页刷新信息
  }

  // 开始时根据正在修改用户ID获取要修改的用户信息
  ngOnInit() {
    this.userService.getUserById(this.userService.modifyID).subscribe((res) => {
      this.user = res;
    });
  }
}
