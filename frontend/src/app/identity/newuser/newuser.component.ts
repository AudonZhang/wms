import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Md5 } from 'ts-md5';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css'],
})
export class NewuserComponent implements OnInit {
  validateForm!: FormGroup;
  users: User[] = [];
  searchRst: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
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
  userPassword = '';

  saveConfirm(): void {
    if (
      this.validateForm.value.changePassword !=
      this.validateForm.value.changePasswordConfirm
    ) {
      // Data validation
      this.message.create('warning', '两次输入的密码不相等!');
      return;
    }
    // 确认修改信息
    this.modal.confirm({
      nzTitle: '<i>确认创建用户?</i>',
      nzContent: `
      <b>ID:${this.user.userID}</b>
      <b>姓名:${this.user.userName}</b>
      <b>性别:${this.user.userGender}</b>
      <b>密码:${this.userPassword}</b>
      <b>电话:${this.user.userPhone}</b>
      <b>邮箱:${this.user.userEmail}</b>
      <b>职务:${this.user.userRole}</b>`,
      nzOnOk: () => this.save(),
    });
    this.user.userPasswordMD5 = Md5.hashStr(this.userPassword);
    this.user.userStatus = '在岗';
    this.user.userCreatedByID = this.userService.loginID;
  }

  save(): void {
    // 提交修改信息
    this.userService.addUser(this.user).subscribe((res) => {
      this.searchRst = res;
      if (this.searchRst == '0') {
        // id已存在
        this.message.create(
          'error',
          'id已存在，若遗忘密码请联系管理员找回，qq765707885!'
        );
      } else {
        this.message.create('success', '注册成功!');
        console.log('submit', this.validateForm.value);
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      changePassword: [null, [Validators.required]],
      changePasswordConfirm: [null, [Validators.required]],
    });
  }
}
