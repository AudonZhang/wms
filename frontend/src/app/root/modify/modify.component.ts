import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
})
export class ModifyComponent implements OnInit {
  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router
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
    userUpdatedByID: '',
    userUpdatedTime: '',
  };

  // After inputting information on the form and clicking save, a dialog box pops up to confirm the information.
  saveConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>请确认用户修改后的信息！</i>',
      nzContent: `<p>姓名：${this.user.userName}</p>
      <p>性别：${this.user.userGender}</p>
      <p>电话：${this.user.userPhone}</p>
      <p>邮箱：${this.user.userEmail}</p>
      <p>职务：${this.user.userRole}</p>`,
      nzOnOk: () => this.save(),
    });
    this.user.userUpdatedByID = this.userService.loginID;
  }

  // Submit the modified information to the backend and return the response.
  save(): void {
    this.userService.updateUser(this.user).subscribe(() => {
      this.updateInformation();
      this.goBack();
      this.message.create('success', '修改成功!');
    });
  }

  // Update content on other pages.
  updateInformation(): void {
    this.userService.updateRoot = true; // Update charts on the root page.
    this.userService.updateAllUsers = true; // Refresh information on the user information page after modifications are completed.
    this.userService.updateName = true; // Update the name displayed in the top right corner of the system.
  }

  // Return to the all-users page after making modifications.
  goBack(): void {
    this.router.navigateByUrl('/index/root/allUsers');
    this.userService.modifyID = ''; // Clear the ID of the user being modified after the modifications are completed.
  }

  // Retrieve the information of the user to be modified based on the ID of the user currently being edited.
  ngOnInit() {
    this.userService.getUserById(this.userService.modifyID).subscribe((res) => {
      this.user = res;
    });
  }
}
