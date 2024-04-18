import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './identity/login/login.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './identity/auth.guard';
import { ChangepasswordComponent } from './identity/changepassword/changepassword.component';
import { UserService } from './services/user.service';
import { OperationrecordComponent } from './identity/operationrecord/operationrecord.component';
import { RootComponent } from './root/root.component';
import { ModifyComponent } from './root/modify/modify.component';
import { NewuserComponent } from './root/newuser/newuser.component';
import { AllUsersComponent } from './root/all-users/all-users.component';
import { GoodsComponent } from './goods/goods.component';
import { AddGoodsComponent } from './goods/add-goods/add-goods.component';
import { AllGoodsComponent } from './goods/all-goods/all-goods.component';
import { ModifyGoodsComponent } from './goods/modify-goods/modify-goods.component';
import { RecordsComponent } from './records/records.component';
import { OutboundComponent } from './records/outbound/outbound.component';
import { InboundComponent } from './records/inbound/inbound.component';
import { PlanComponent } from './plan/plan.component';
import { InPlanComponent } from './plan/in-plan/in-plan.component';
import { OutPlanComponent } from './plan/out-plan/out-plan.component';
import { AllboundComponent } from './records/allbound/allbound.component';
import { AllplanComponent } from './plan/allplan/allplan.component';
import { FinishPlanComponent } from './plan/finish-plan/finish-plan.component';
import { ChangeInformationComponent } from './identity/change-information/change-information.component';

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
        path: ':userID/changePassword',
        component: ChangepasswordComponent,
        data: {
          breadcrumb: '密码修改',
        },
      },
      {
        path: ':userID/changeInformation',
        component: ChangeInformationComponent,
        data: {
          breadcrumb: '信息修改',
        },
      },
      {
        path: ':userID/operationrecord',
        component: OperationrecordComponent,
        data: {
          breadcrumb: '操作记录',
        },
      },
      {
        path: 'root',
        component: RootComponent,
        data: {
          breadcrumb: '用户管理',
        },
        children: [
          {
            path: 'new',
            component: NewuserComponent,
            data: {
              breadcrumb: '新建用户',
            },
          },
          {
            path: 'allUsers',
            component: AllUsersComponent,
            data: {
              breadcrumb: '用户信息',
            },
            children: [
              {
                path: 'modify',
                component: ModifyComponent,
                data: {
                  breadcrumb: '用户信息修改',
                },
              },
            ],
          },
        ],
      },
      {
        path: 'goods',
        component: GoodsComponent,
        data: {
          breadcrumb: '货物管理',
        },
        children: [
          {
            path: 'new',
            component: AddGoodsComponent,
            data: {
              breadcrumb: '新建货物',
            },
          },
          {
            path: 'all',
            component: AllGoodsComponent,
            data: {
              breadcrumb: '货物信息',
            },
            children: [
              {
                path: 'modify',
                component: ModifyGoodsComponent,
                data: {
                  breadcrumb: '货物信息修改',
                },
              },
            ],
          },
        ],
      },
      {
        path: 'records',
        component: RecordsComponent,
        data: {
          breadcrumb: '出入库管理',
        },
        children: [
          {
            path: 'inbound',
            component: InboundComponent,
            data: {
              breadcrumb: '入库',
            },
          },
          {
            path: 'outbound',
            component: OutboundComponent,
            data: {
              breadcrumb: '出库',
            },
          },
          {
            path: 'allbound',
            component: AllboundComponent,
            data: {
              breadcrumb: '出入库信息',
            },
          },
        ],
      },
      {
        path: 'plan',
        component: PlanComponent,
        data: {
          breadcrumb: '计划管理',
        },
        children: [
          {
            path: 'in',
            component: InPlanComponent,
            data: {
              breadcrumb: '新增入库计划',
            },
          },
          {
            path: 'out',
            component: OutPlanComponent,
            data: {
              breadcrumb: '新增出库计划',
            },
          },
          {
            path: 'finish',
            component: FinishPlanComponent,
            data: {
              breadcrumb: '完成计划',
            },
          },
          {
            path: 'all',
            component: AllplanComponent,
            data: {
              breadcrumb: '全部计划',
            },
          },
        ],
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
