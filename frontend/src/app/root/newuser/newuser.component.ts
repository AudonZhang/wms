import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Md5 } from 'ts-md5';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css'],
})
export class NewuserComponent implements OnInit {
  passwordVisible1 = false; // 密码输入框内容是否可见
  passwordVisible2 = false;
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
  userPassword = '';

  validateForm: FormGroup<{
    gender: FormControl<string>;
    role: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    name: FormControl<string>;
    phoneNumber: FormControl<string>;
  }>;

  submitForm(): void {
    // 将提交的值赋值给用户类型
    if (this.validateForm.valid) {
      this.user.userName = this.validateForm.controls['name'].value;
      this.user.userGender = this.validateForm.controls['gender'].value;
      this.user.userRole = this.validateForm.controls['role'].value;
      this.user.userPasswordMD5 = Md5.hashStr(
        this.validateForm.controls['password'].value.toString()
      );
      this.user.userPhone = this.validateForm.controls['phoneNumber'].value;
      this.user.userEmail = this.validateForm.controls['email'].value;
      this.user.userStatus = '在职';
      this.user.userUpdatedByID = this.userService.loginID;

      // 确认创建用户的信息
      this.informationConfirm();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // 新建用户信息确认
  informationConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>请确认新用户信息，并牢记ID与密码!!!</i>',
      nzContent: `
    <p>ID：${this.user.userID}</p>
    <p>姓名：${this.user.userName}</p>
    <p>性别：${this.user.userGender}</p>
    <p>密码：${this.validateForm.controls['password'].value}</p>
    <p>电话：${this.user.userPhone}</p>
    <p>邮箱：${this.user.userEmail}</p>
    <p>职务：${this.user.userRole}</p>`,
      nzOnOk: () => this.save(),
    });
  }

  save(): void {
    // 提交创建信息
    this.userService.addUser(this.user).subscribe((res) => {
      if (res == '1') {
        this.message.create('success', '新增用户成功!');
        console.log('submit', this.validateForm.value);
        this.userService.afterModifyRoot = true;
        this.router.navigateByUrl('/index/root/allUsers');
      } else {
        this.message.create('error', '新增用户失败，用户ID已存在!');
      }
    });
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator: ValidatorFn = (
    control: AbstractControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService,
    private userService: UserService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      gender: [''],
      role: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      name: ['', [Validators.required]],
      phoneNumber: [''],
    });
  }

  // 开始时获取新增用户的ID
  ngOnInit(): void {
    this.userService.getMaxUserID().subscribe((res) => {
      let numberID: number = +res;
      // 将数字加一
      let IDPlus1: number = numberID + 1;
      this.user.userID = IDPlus1.toString();
    });
  }
}
