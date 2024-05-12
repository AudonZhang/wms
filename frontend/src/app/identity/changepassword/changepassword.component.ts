import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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
  passwordVisible1 = false; // Input box content visible
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
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  // Click "Save"
  saveConfirm(): void {
    // The original password is incorrect
    if (
      Md5.hashStr(this.validateForm.value.OldPassword) !=
      this.user.userPasswordMD5
    ) {
      this.message.create('warning', '原密码错误!');
      return;
    }
    // The new password is the same as the original password
    if (
      this.validateForm.value.changePassword ==
      this.validateForm.value.OldPassword
    ) {
      this.message.create('warning', '新密码与原密码相同!');
      return;
    }
    // The new password and the password confirmation do not match
    if (
      this.validateForm.value.changePassword !=
      this.validateForm.value.changePasswordConfirm
    ) {
      this.message.create('warning', '两次输入的密码不同!');
      return;
    }
    // Get the MD5 value of the new password
    this.user.userPasswordMD5 = Md5.hashStr(
      this.validateForm.value.changePassword
    );

    // Confirmation dialog
    this.modal.confirm({
      nzTitle: '<i>确认修改密码?</i>',
      nzOnOk: () => this.save(),
      nzOnCancel: () => this.goBack(),
    });
  }

  // Submit the new password and log in again
  save(): void {
    this.userService.updateUser(this.user).subscribe();
    this.notification.create('success', '修改成功!', `请重新登录 !`);
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    window.location.reload();
  }

  // Click "back"
  goBack(): void {
    this.resetForm();
  }

  // Clear the input content
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
