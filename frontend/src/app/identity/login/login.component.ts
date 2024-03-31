import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
export class LoginComponent {
  validateForm: FormGroup<{
    userID: FormControl<string>;
    userPassword: FormControl<string>;
  }>;
  loginMessage: Login = {
    userID: '',
    userPasswordMD5: '',
  };
  loginResult?: string;

  constructor(
    private message: NzMessageService,
    private userService: UserService,
    private notification: NzNotificationService,
    private router: Router,
    private fb: NonNullableFormBuilder
  ) {
    this.validateForm = this.fb.group({
      userID: ['', [Validators.required]],
      userPassword: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loginMessage.userID = this.validateForm.controls['userID'].value;
      this.loginMessage.userPasswordMD5 = Md5.hashStr(
        this.validateForm.controls['userPassword'].value
      );
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
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  confirmationValidator: ValidatorFn = (
    control: AbstractControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !== this.validateForm.controls.userPassword.value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
