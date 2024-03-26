import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
})
export class ChangepasswordComponent implements OnInit {
  validateForm!: FormGroup;
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

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  saveConfirm(): void {
    // Confirm the modification information
    if (
      Md5.hashStr(this.validateForm.value.OldPassword) !=
      this.user.userPasswordMD5
    ) {
      // Data validation
      this.message.create('warning', '原密码错误!');
      return;
    }
    if (
      this.validateForm.value.changePassword !=
      this.validateForm.value.changePasswordConfirm
    ) {
      // Data validation
      this.message.create('warning', '两次输入的密码不相等!');
      return;
    }
    this.user.userPasswordMD5 = Md5.hashStr(
      this.validateForm.value.changePassword
    );
    this.modal.confirm({
      nzTitle: '<i>确认修改密码?</i>',
      nzOnOk: () => this.save(),
    });
  }

  save(): void {
    // Submit the modification information
    this.userService.updateUser(this.user).subscribe(() => this.goBack());
    this.message.info('修改成功!');
  }

  goBack(): void {
    this.location.back();
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
