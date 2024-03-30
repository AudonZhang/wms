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
  // 接受后端发回的信息，判断创建用户的id是否重复
  searchRst: string = '';

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
  userPassword = '';

  validateForm: FormGroup<{
    // id: FormControl<string>;
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
      // this.user.userID = this.validateForm.controls['id'].value;
      this.user.userName = this.validateForm.controls['name'].value;
      this.user.userGender = this.validateForm.controls['gender'].value;
      this.user.userRole = this.validateForm.controls['role'].value;
      this.user.userPasswordMD5 = Md5.hashStr(
        this.validateForm.controls['password'].value.toString()
      );
      this.user.userPhone = this.validateForm.controls['phoneNumber'].value;
      this.user.userEmail = this.validateForm.controls['email'].value;
      this.user.userStatus = '在职';
      this.user.userCreatedByID = this.userService.loginID;

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

  informationConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>请确认新用户信息，并牢记ID与密码</i>',
      nzContent: `
    <b>ID:${this.user.userID}</b>
    <b>姓名:${this.user.userName}</b>
    <b>性别:${this.user.userGender}</b>
    <b>密码:${this.validateForm.controls['password'].value}</b>
    <b>电话:${this.user.userPhone}</b>
    <b>邮箱:${this.user.userEmail}</b>
    <b>职务:${this.user.userRole}</b>`,
      nzOnOk: () => this.save(),
    });
  }

  save(): void {
    // 提交创建信息
    this.userService.addUser(this.user).subscribe((res) => {
      this.searchRst = res;
      // if (this.searchRst == '0') {
      //   this.message.create('error', 'id已存在');
      // } else {
      this.message.create('success', '新增用户成功!');
      console.log('submit', this.validateForm.value);
      this.router.navigateByUrl('/index/root/allUsers');
      // }
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
      // id: ['', [Validators.required, Validators.pattern(/^.{7}$/)]],
      gender: [''],
      role: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      name: ['', [Validators.required]],
      phoneNumber: [''],
    });
  }

  ngOnInit(): void {
    this.userService.getNewUserID().subscribe((res) => {
      this.user.userID = res;
    });
  }
}
