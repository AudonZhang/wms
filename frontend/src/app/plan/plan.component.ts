import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Plan } from '../interfaces/plan';
import { PlanService } from '../services/plan.service';
import { Goods } from '../interfaces/goods';
import { GoodsService } from '../services/goods.service';
import { NzTableFilterFn } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
})
export class PlanComponent implements OnInit {
  plans: Plan[] = [];
  plansDisplay: {
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = [];
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService,
    private message: NzMessageService,
    private goodsService: GoodsService
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

  // 获取所有计划
  getPlans(): void {
    this.planService.getAllPlans().subscribe((res) => {
      this.plans = res;
      // 更新 plansDisplay，使用 PlanService 中的 getGoodsById 获取 goodsName
      this.plansDisplay = this.plans.map((plan) => {
        return {
          plan: plan,
          goodsName: '',
          goodsManufacturer: '',
          goodsSpecification: '',
        };
      });
      // 为每个计划获取 goodsName
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
        // 按照 planStatus 排序
        if (a.plan.planStatus === '未完成' && b.plan.planStatus === '已完成') {
          return -1; // 未完成排在已完成之上
        } else if (
          a.plan.planStatus === '已完成' &&
          b.plan.planStatus === '未完成'
        ) {
          return 1; // 已完成排在未完成之下
        } else {
          // 如果状态相同，则按照 planExpectedTime 排序
          const timeA = new Date(a.plan.planExpectedTime).getTime();
          const timeB = new Date(b.plan.planExpectedTime).getTime();
          return timeB - timeA;
        }
      });
    });
  }

  // 重置搜索内容
  reset(): void {
    this.searchValue = '';
    this.search();
  }

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

  // 保存需要修改的货物ID，跳转后的组件可根据此获得对应货物信息
  // setModifyGoodsID(goodsID: string): void {
  //   this.goodsService.modifyID = goodsID;
  // }

  ngOnInit(): void {
    this.getPlans();

    // 每秒获取是否已修改货物信息，若已修改则刷新货物信息列表
    //   setInterval(() => {
    //     if (this.goodsService.afterModify) {
    //       this.goodsService.afterModify = false;
    //       this.getGoods();
    //     }
    //   }, 1000);
    // }
  }
}
