import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private message: NzMessageService
  ) {}
  userID?: string;
  userName?: string;
  userRole?: string;

  exit(): void {
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    window.location.reload();
  }

  backup(): void {
    this.userService.backup().subscribe((res) => {
      if (res) {
        this.message.info('备份成功!');
      }
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.userID = this.userService.loginID;
      this.userName = this.userService.loginName;
      this.userRole = this.userService.loginRole;
    }, 1000);
  }
}
