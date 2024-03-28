import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filter } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
})
export class RootComponent implements OnInit {
  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  users: User[] = []; // 学生信息列表
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  usersDisplay?: User[]; // 搜索功能显示列表

  user?: User;

  getUsers(): void {
    this.userService.getUsers().subscribe((res) => {
      this.users = res.sort((a, b) => {
        // 如果a.userStatus为"离职"，而b.userStatus不是"离职"，则a排在b后面
        if (a.userStatus === '离职' && b.userStatus !== '离职') {
          return 1;
        }
        // 如果a.userStatus不是"离职"，而b.userStatus为"离职"，则b排在a后面
        else if (a.userStatus !== '离职' && b.userStatus === '离职') {
          return -1;
        }
        // 否则，保持原有顺序
        else {
          return 0;
        }
      });
      this.usersDisplay = this.users;
    });
  }

  reset(): void {
    // 重置搜索内容
    this.searchValue = '';
    this.search();
  }

  search(): void {
    // 根据姓名搜索
    this.visible = false;
    this.usersDisplay = this.users.filter(
      (item: User) => item.userName.indexOf(this.searchValue) !== -1
    );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示所有姓名包含 ${this.searchValue} 的用户信息!`
      );
    else this.message.create('success', '已重置用户列表！');
  }

  deleteConfirm(userID: string, userName: string): void {
    // 确认删除对话框
    this.modal.confirm({
      nzTitle: '<i>确认解雇该用户?</i>',
      nzContent: `<b>ID:${userID}; 姓名:${userName}</b>`,
      nzOnOk: () => {
        if (userID == this.userService.loginID)
          // 判断删除的用户是否为当前登录的管理员账户
          this.administratorConfirm(userID, userName);
        else this.deleteUser(userID);
      },
    });
  }
  takeConfirm(userID: string, userName: string): void {
    // 确认删除对话框
    this.modal.confirm({
      nzTitle: '<i>确认恢复该用户?</i>',
      nzContent: `<b>ID:${userID}; 姓名:${userName}</b>`,
      nzOnOk: () => {
        this.takeUser(userID);
      },
    });
  }

  deleteUser(userID: string): void {
    //  删除学生信息
    this.userService.deleteUser(userID).subscribe(); //  调用学生服务的方法删除
    if (userID == this.userService.loginID) {
      // 判断是否正在删除管理员账户
      this.userService.loginID = '';
      this.notification.create('warning', '当前管理员被解雇!', '请重新登录!');
      this.router.navigateByUrl('');
    }
    this.notification.create(
      'success',
      '解雇成功!',
      `成功解雇ID为${userID}的用户!`
    );
    this.getUsers();
  }

  takeUser(userID: string): void {
    //  删除学生信息
    this.userService.takeUser(userID).subscribe(); //  调用学生服务的方法删除
    this.notification.create(
      'success',
      '恢复成功!',
      `成功恢复ID为${userID}的用户!`
    );
    this.getUsers();
  }

  administratorConfirm(userID: string, userName: string): void {
    // 与用户确认当前删除的用户是管理员
    this.modal.confirm({
      nzTitle: '<i>该账号为管理员账号!</i>',
      nzContent: `确认解雇该管理员?</b>`,
      nzOnOk: () => this.deleteUser(userID),
    });
  }

  setModifyUserID(userID: string): void {
    this.userService.modifyID = userID;
  }

  ngOnInit(): void {
    // setInterval(() => {
    // 每秒同步登录信息
    this.getUsers();
    // }, 1000);
  }
}
