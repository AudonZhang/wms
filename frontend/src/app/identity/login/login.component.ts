import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UserService } from 'src/app/services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  loginMessage?: Login;
  loginResult?: string;

  constructor(
    public login: FormBuilder,
    private message: NzMessageService,
    private userService: UserService,
    private notification: NzNotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  submitForm(): void {
    this.loginMessage = {
      userID: this.validateForm.value.userID,
      userPasswordMD5: Md5.hashStr(this.validateForm.value.userPassword),
    };
    this.userService.login(this.loginMessage).subscribe((res) => {
      this.loginResult = res;
      if (this.loginResult == '1') {
        this.userService.loginID += this.loginMessage?.userID;
        this.userService
          .getUserById(this.userService.loginID)
          .subscribe((res) => {
            this.userService.loginName = res.userName;
            this.userService.loginRole = res.userRole;
            this.notification.create(
              'success',
              '登录成功!',
              `欢迎, ${res.userName} !`
            );
          });
        const url = '/index';
        this.router.navigateByUrl(url);
      } else this.message.create('error', '用户信息错误或用户不存在！');
    });
  }

  idValidator() {
    return (
      control: import('@angular/forms').AbstractControl
    ): { [key: string]: any } | null => {
      const value = control.value;
      if (!/^\d{7}$/.test(value)) {
        return { invalidSevenDigit: { value: value } };
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userID: [null, [Validators.required, this.idValidator()]],
      userPassword: [null, [Validators.required]],
    });
  }
}
