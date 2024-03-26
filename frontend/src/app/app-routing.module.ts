import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './identity/login/login.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './identity/auth.guard';
import { ChangepasswordComponent } from './identity/changepassword/changepassword.component';
import { UserService } from './services/user.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  {
    path: 'index',
    component: IndexComponent,
    canActivate: [AuthGuard], // AuthGuard：If you are not logged in, you will not be able to access '/index'
    data: {
      breadcrumb: '主页',
    },
    children: [
      {
        path: ':userID/changepassword',
        component: ChangepasswordComponent,
        data: {
          breadcrumb: '密码修改',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule implements OnInit {
  userID = '';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userID = this.userService.loginID;
  }
}
