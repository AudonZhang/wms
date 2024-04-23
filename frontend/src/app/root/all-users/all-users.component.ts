import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableFilterFn } from 'ng-zorro-antd/table';
import { filter } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit, DoCheck {
  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // 进入子页面时，不显示该页面内容
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  users: User[] = []; // 展示所有学生信息
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  usersDisplay: User[] = []; // 搜索后的学生信息

  // 筛选职务函数
  filterRole: NzTableFilterFn<User> = (list: string[], item: User) =>
    list.some((role) => item.userRole.indexOf(role) !== -1);

  // 筛选状态函数
  filterStatus: NzTableFilterFn<User> = (list: string[], item: User) =>
    list.some((status) => item.userStatus.indexOf(status) !== -1);

  // 获取所有用户信息并排序
  getUsers(): void {
    this.userService.getAllUsers().subscribe((res) => {
      // 排序，"在职"在前，"离职"在后
      this.users = res.sort((a, b) => {
        if (a.userStatus === '离职' && b.userStatus !== '离职') {
          return 1;
        } else if (a.userStatus !== '离职' && b.userStatus === '离职') {
          return -1;
        } else {
          return 0;
        }
      });
      this.usersDisplay = this.users;
    });
  }

  // 重置搜索内容
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  // 根据姓名搜索
  search(): void {
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

  // 解雇用户时确认解雇的用户信息
  unemployConfirm(userID: string, userName: string): void {
    this.modal.confirm({
      nzTitle: '<i>确认解雇该用户?</i>',
      nzContent: `<b>ID:${userID}; 姓名:${userName}</b>`,
      nzOnOk: () => {
        if (userID == this.userService.loginID)
          // 判断解雇的用户是否为当前的登录账户
          this.administratorConfirm(userID);
        else this.unemployUser(userID);
      },
    });
  }

  // 与确认是否解雇当前管理员账户
  administratorConfirm(userID: string): void {
    this.modal.confirm({
      nzTitle: '<i>该账号为管理员账号!</i>',
      nzContent: `确认解雇该管理员?</b>`,
      nzOnOk: () => this.unemployUser(userID),
    });
  }

  // 解雇用户
  unemployUser(userID: string): void {
    this.userService.unemployUser(userID).subscribe(() => {
      if (userID == this.userService.loginID) {
        // 判断是否正在解雇当前登陆账户
        this.userService.loginID = '';
        this.notification.create('warning', '当前用户被解雇!', '请重新登录!');
        this.router.navigateByUrl('');
      } else {
        this.notification.create(
          'success',
          '解雇成功!',
          `成功解雇ID为${userID}的用户!`
        );
      }
      this.updateInformation();
    });
  }

  // 恢复用户时确认信息
  employConfirm(userID: string, userName: string): void {
    this.modal.confirm({
      nzTitle: '<i>确认恢复该用户?</i>',
      nzContent: `<b>ID:${userID}; 姓名:${userName}</b>`,
      nzOnOk: () => {
        this.employUser(userID);
      },
    });
  }

  // 恢复用户
  employUser(userID: string): void {
    this.userService.employUser(userID).subscribe(() => {
      this.notification.create(
        'success',
        '恢复成功!',
        `成功恢复ID为${userID}的用户!`
      );
      this.updateInformation();
    });
  }

  // 更新其他组件的信息
  updateInformation(): void {
    this.userService.updateAllUsers = true; // 更新allUsers页的信息
    this.userService.updateRoot = true; // 更新root页的图表
  }

  // 设置正在修改的用户的ID
  setModifyUserID(userID: string): void {
    this.userService.modifyID = userID;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngDoCheck(): void {
    if (this.userService.updateAllUsers) {
      this.getUsers();
      this.userService.updateAllUsers = false;
    }
  }
}
