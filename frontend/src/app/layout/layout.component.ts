import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}
  userID?: string;
  userName?: string;
  userRole?: string;

  exit(): void {
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    window.location.reload();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.userID = this.userService.loginID;
      this.userName = this.userService.loginName;
      this.userRole = this.userService.loginRole;
    }, 1000);
  }
}
