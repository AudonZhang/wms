import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { LoginComponent } from './identity/login/login.component';
import { IndexComponent } from './index/index.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ChangepasswordComponent } from './identity/changepassword/changepassword.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { OperationrecordComponent } from './identity/operationrecord/operationrecord.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { RootComponent } from './root/root.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ModifyComponent } from './root/modify/modify.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NewuserComponent } from './root/newuser/newuser.component';
import { AllUsersComponent } from './root/all-users/all-users.component';
import { AllGoodsComponent } from './goods/all-goods/all-goods.component';
import { GoodsComponent } from './goods/goods.component';
import { AddGoodsComponent } from './goods/add-goods/add-goods.component';
import { ModifyGoodsComponent } from './goods/modify-goods/modify-goods.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { RecordsComponent } from './records/records.component';
import { OutboundComponent } from './records/outbound/outbound.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { InboundComponent } from './records/inbound/inbound.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { InPlanComponent } from './plan/in-plan/in-plan.component';
import { OutPlanComponent } from './plan/out-plan/out-plan.component';
import { PlanComponent } from './plan/plan.component';
import { InOrOutboundPipePipe } from './pipes/in-or-outbound-pipe.pipe';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AllboundComponent } from './records/allbound/allbound.component';
import { AllplanComponent } from './plan/allplan/allplan.component';
import { FinishPlanComponent } from './plan/finish-plan/finish-plan.component';
import { ChangeInformationComponent } from './identity/change-information/change-information.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    IndexComponent,
    ChangepasswordComponent,
    OperationrecordComponent,
    RootComponent,
    ModifyComponent,
    NewuserComponent,
    AllUsersComponent,
    AllGoodsComponent,
    GoodsComponent,
    AddGoodsComponent,
    ModifyGoodsComponent,
    RecordsComponent,
    OutboundComponent,
    InboundComponent,
    InPlanComponent,
    OutPlanComponent,
    PlanComponent,
    InOrOutboundPipePipe,
    AllboundComponent,
    AllplanComponent,
    FinishPlanComponent,
    ChangeInformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzModalModule,
    NzTableModule,
    NzPopoverModule,
    NzDividerModule,
    NzSelectModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzInputNumberModule,
    NzUploadModule,
    NzAvatarModule,
    NzBadgeModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
})
export class AppModule {}
