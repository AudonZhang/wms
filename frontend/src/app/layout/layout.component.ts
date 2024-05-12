import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Plan } from '../interfaces/plan';
import { PlanService } from '../services/plan.service';
import { GoodsService } from '../services/goods.service';
import { RootService } from '../services/root.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private rootService: RootService,
    private planService: PlanService,
    private message: NzMessageService,
    private goodsService: GoodsService
  ) {}
  // Current logged-in user information
  userID?: string;
  userName?: string;
  userRole?: string;
  planNum = 0;

  plans: Plan[] = [];
  plansDisplay: {
    plan: Plan;
    goodsName: string;
  }[] = [];

  // Log out
  exit(): void {
    this.userService.loginID = '';
    this.userService.loginName = '';
    this.userService.loginRole = '';
    window.location.reload();
  }

  // Backup
  backup(): void {
    this.rootService.backup();
    this.message.create('success', '备份文件已在浏览器下载!');
  }

  getPlans(): void {
    this.planService.getAllPlans().subscribe((res) => {
      this.plans = res;
      this.plansDisplay = this.plans.map((plan) => {
        return {
          plan: plan,
          goodsName: '',
        };
      });
      // Get the names of goods in the plan
      this.plansDisplay.forEach((planDisplay) => {
        this.goodsService
          .getGoodsById(planDisplay.plan.planGoodsID)
          .subscribe((goods) => {
            planDisplay.goodsName = goods.goodsName;
          });
      });

      // Sort by time
      this.plansDisplay.sort((a, b) => {
        const timeA = new Date(a.plan.planExpectedTime).getTime();
        const timeB = new Date(b.plan.planExpectedTime).getTime();
        return timeA - timeB;
      });
      //Filter unfinished plans
      this.plansDisplay = this.plansDisplay.filter(
        (planDisplay) => planDisplay.plan.planStatus === '未完成'
      );
      this.planNum = this.plansDisplay.length; // Count the number of unfinished records
    });
  }

  // Get the login user's information every second
  ngOnInit(): void {
    this.getPlans();
    this.userID = this.userService.loginID;
    this.userName = this.userService.loginName;
    this.userRole = this.userService.loginRole;
    setInterval(() => {
      if (this.planService.updateLayout) {
        this.getPlans();
        this.planService.updateLayout = false;
      }
      if (this.userService.updateName) {
        this.userService
          .getUserById(this.userService.loginID)
          .subscribe((res) => {
            this.userService.loginName = res.userName;
            this.userService.loginRole = res.userRole;
            this.userName = res.userName;
            this.userRole = res.userRole;
          });
        this.userService.updateName = false;
      }
    }, 1000);
  }
}
