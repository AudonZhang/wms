import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Plan } from '../../interfaces/plan';
import { PlanService } from '../../services/plan.service';
import { Goods } from '../../interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzTableFilterFn } from 'ng-zorro-antd/table';
import { UserService } from 'src/app/services/user.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-allplan',
  templateUrl: './allplan.component.html',
  styleUrls: ['./allplan.component.css'],
})
export class AllplanComponent implements OnInit {
  plans: Plan[] = []; // 所有计划信息
  plansDisplay: {
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = []; // 前端展示的计划信息
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  userRole = '';

  filterInOut: NzTableFilterFn<{
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }> = (
    list: string[],
    item: {
      plan: Plan;
      goodsName: string;
      goodsSpecification: string;
      goodsManufacturer: string;
    }
  ) => list.some((inOut) => item.plan.inOrOutbound.indexOf(inOut) !== -1);

  filterStatus: NzTableFilterFn<{
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }> = (
    list: string[],
    item: {
      plan: Plan;
      goodsName: string;
      goodsSpecification: string;
      goodsManufacturer: string;
    }
  ) => list.some((status) => item.plan.planStatus.indexOf(status) !== -1);

  constructor(
    private planService: PlanService,
    private message: NzMessageService,
    private goodsService: GoodsService,
    private userService: UserService,
    private modal: NzModalService
  ) {}

  // 获取所有计划
  getPlans(): void {
    this.planService.getAllPlans().subscribe((res) => {
      this.plans = res;
      this.plansDisplay = this.plans.map((plan) => {
        return {
          plan: plan,
          goodsName: '',
          goodsManufacturer: '',
          goodsSpecification: '',
        };
      });
      // 为每个计划获取对应的货物信息
      this.plansDisplay.forEach((planDisplay, index) => {
        this.goodsService
          .getGoodsById(planDisplay.plan.planGoodsID)
          .subscribe((goods: Goods) => {
            this.plansDisplay[index].goodsName = goods.goodsName;
            this.plansDisplay[index].goodsManufacturer =
              goods.goodsManufacturer;
            this.plansDisplay[index].goodsSpecification =
              goods.goodsSpecification;
          });
      });
      this.plansDisplay.sort((a, b) => {
        // 优先展示未完成计划
        if (a.plan.planStatus === '未完成' && b.plan.planStatus === '已完成') {
          return -1;
        } else if (
          a.plan.planStatus === '已完成' &&
          b.plan.planStatus === '未完成'
        ) {
          return 1;
        } else {
          // 按照时间由近到远排序
          const timeA = new Date(a.plan.planExpectedTime).getTime();
          const timeB = new Date(b.plan.planExpectedTime).getTime();
          return timeA - timeB;
        }
      });
    });
  }

  // 根据货物名字搜索
  search(): void {
    this.visible = false;
    if (this.searchValue !== '') {
      this.plansDisplay = this.plansDisplay.filter((item) =>
        item.goodsName.includes(this.searchValue)
      );
      this.message.create(
        'success',
        `已展示所有名称包含 "${this.searchValue}" 的货物信息!`
      );
    } else {
      // 如果搜索值为空，则重置货物列表
      this.getPlans();
      this.message.create('success', '已重置货物列表！');
    }
  }

  deleteConfirm(id: string): void {
    // 确认删除对话框
    this.modal.confirm({
      nzTitle: '<i>确认删除计划?</i>',
      nzOnOk: () => this.deletePlan(id),
    });
  }

  deletePlan(id: string): void {
    // 删除预约信息
    this.planService.deletePlan(id).subscribe();
    this.planService.afterModifyPlan = true;
    this.message.create('success', '删除成功!');
  }

  // 重置搜索内容
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.userRole = this.userService.loginRole;
    this.getPlans();
    setInterval(() => {
      if (this.planService.afterModifyPlan) {
        this.getPlans();
        this.planService.afterModifyPlan = false;
      }
    }, 1000);
  }
}
