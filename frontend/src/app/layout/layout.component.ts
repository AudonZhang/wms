import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Plan } from '../interfaces/plan';
import { PlanService } from '../services/plan.service';
import { GoodsService } from '../services/goods.service';
import { Goods } from '../interfaces/goods';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private planService: PlanService,
    private message: NzMessageService,
    private goodsService: GoodsService
  ) {}
  // 当前的登陆用户信息
  userID?: string;
  userName?: string;
  userRole?: string;
  planNum = 0;

  plans: Plan[] = [];
  plansDisplay: {
    plan: Plan;
    goodsName: string;
  }[] = [];

  // 退出登录
  exit(): void {
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    window.location.reload();
  }

  // 备份功能
  backup(): void {
    this.userService.backup();
    this.message.create('success', '备份文件已在浏览器下载!');
  }

  getPlans(): void {
    this.planService.getAllPlans().subscribe((res) => {
      this.plans = res;
      // 更新 plansDisplay，使用 PlanService 中的 getGoodsById 获取 goodsName
      this.plansDisplay = this.plans.map((plan) => {
        return {
          plan: plan,
          goodsName: '',
        };
      });
      // 为每个计划获取 goodsName
      this.plansDisplay.forEach((planDisplay) => {
        this.goodsService
          .getGoodsById(planDisplay.plan.planGoodsID)
          .subscribe((goods) => {
            planDisplay.goodsName = goods.goodsName;
          });
      });

      // 按时间排序
      this.plansDisplay.sort((a, b) => {
        const timeA = new Date(a.plan.planExpectedTime).getTime();
        const timeB = new Date(b.plan.planExpectedTime).getTime();
        return timeB - timeA;
      });
      // 筛选出状态为'未完成'的计划
      this.plansDisplay = this.plansDisplay.filter(
        (planDisplay) => planDisplay.plan.planStatus === '未完成'
      );
      this.planNum = this.plansDisplay.length; // 计数未完成记录的数量
    });
  }

  // 每秒获取登录用户的信息
  ngOnInit(): void {
    this.getPlans();
    setInterval(() => {
      this.userID = this.userService.loginID;
      this.userName = this.userService.loginName;
      this.userRole = this.userService.loginRole;
      if (this.planService.afterModifyLayout) {
        this.getPlans();
        this.planService.afterModifyLayout = false;
      }
    }, 1000);
  }
}
