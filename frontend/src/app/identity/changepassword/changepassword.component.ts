import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
})
export class ChangepasswordComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible1 = false; // 密码输入框是否可见
  passwordVisible2 = false;
  passwordVisible3 = false;
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

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  // 用户提交后进行判断
  saveConfirm(): void {
    // 旧密码错误
    if (
      Md5.hashStr(this.validateForm.value.OldPassword) !=
      this.user.userPasswordMD5
    ) {
      this.message.create('warning', '原密码错误!');
      return;
    }
    // 新密码与原密码相同
    if (
      this.validateForm.value.changePassword ==
      this.validateForm.value.OldPassword
    ) {
      this.message.create('warning', '新密码与原密码相同!');
      return;
    }
    // 新密码与新密码确认不相同
    if (
      this.validateForm.value.changePassword !=
      this.validateForm.value.changePasswordConfirm
    ) {
      this.message.create('warning', '两次输入的密码不相等!');
      return;
    }
    // 将新密码转化为MD5值
    this.user.userPasswordMD5 = Md5.hashStr(
      this.validateForm.value.changePassword
    );

    // 弹出对话框，让用户选择确认或返回
    this.modal.confirm({
      nzTitle: '<i>确认修改密码?</i>',
      nzOnOk: () => this.save(),
      nzOnCancel: () => this.goBack(),
    });
  }

  // 用户选择确认
  save(): void {
    this.userService.updateUser(this.user).subscribe();
    this.message.info('修改成功!');
    this.resetForm();
  }

  // 用户选择返回
  goBack(): void {
    this.resetForm();
  }

  // 清空表格内容
  resetForm(): void {
    this.validateForm.reset();
    Object.keys(this.validateForm.controls).forEach((key) => {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      OldPassword: [null, [Validators.required]],
      changePassword: [null, [Validators.required]],
      changePasswordConfirm: [null, [Validators.required]],
    });
    this.userService.getUserById(this.userService.loginID).subscribe((res) => {
      this.user = res;
    });
  }
}
