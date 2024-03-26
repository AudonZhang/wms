import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
// the html framework
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private router: Router
  ) {}
  userID?: string;
  userName?: string;
  userRole?: string;

  // Sign out
  exit(): void {
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    this.message.info('退出登录!');
    window.location.reload();
  }

  ngOnInit(): void {
    // syn login information every second
    setInterval(() => {
      this.userID = this.userService.loginID;
      this.userName = this.userService.loginName;
      this.userRole = this.userService.loginRole;
    }, 1000);
  }
}
