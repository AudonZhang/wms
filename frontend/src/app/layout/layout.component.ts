import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) {}
  // 当前的登陆用户信息
  userID?: string;
  userName?: string;
  userRole?: string;

  // 退出登录
  exit(): void {
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    window.location.reload();
  }

  // 备份功能
  backup(): void {
    this.userService.backup();
    this.message.create('success', '备份文件已在浏览器下载!');
  }

  // 每秒获取登录用户的信息
  ngOnInit(): void {
    setInterval(() => {
      this.userID = this.userService.loginID;
      this.userName = this.userService.loginName;
      this.userRole = this.userService.loginRole;
    }, 1000);
  }
}
