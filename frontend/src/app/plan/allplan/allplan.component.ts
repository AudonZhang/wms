import { Component, OnInit } from '@angular/core';
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
  planSelected: {
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  } = {
    plan: {
      planID: '',
      inOrOutbound: '',
      planGoodsID: '',
      planExpectedTime: '',
      planExpectedAmount: 0,
      planStatus: '',
      planUpdatedByID: '',
      planUpdatedTime: '',
      planFinishedByID: '',
      planFinishedTime: '',
    },
    goodsName: '',
    goodsSpecification: '',
    goodsManufacturer: '',
  };
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  userRole = '';
  confirmVisible = false; // 确认出库对话框

  // 筛选函数
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
      this.plansDisplay.forEach((planDisplay) => {
        this.goodsService
          .getGoodsById(planDisplay.plan.planGoodsID)
          .subscribe((goods: Goods) => {
            planDisplay.goodsName = goods.goodsName;
            planDisplay.goodsManufacturer = goods.goodsManufacturer;
            planDisplay.goodsSpecification = goods.goodsSpecification;
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

  deletePlan(id: string): void {
    // 根据ID查找计划信息
    const selectedPlan = this.plansDisplay.find(
      (plan) => plan.plan.planID === id
    );

    if (selectedPlan) {
      this.planSelected = selectedPlan;
    } else {
      console.error(`无法找到ID为${id}的计划信息。`);
    }
    this.showModal();
  }

  showModal(): void {
    // 打开确认对话框
    this.confirmVisible = true;
  }

  handleOk(): void {
    this.planService.deletePlan(this.planSelected.plan.planID).subscribe();
    this.planService.updateAllPlan = true;
    this.planService.updatePlan = true;
    this.confirmVisible = false;
    this.message.create('success', '删除成功!');
  }

  handleCancel(): void {
    this.confirmVisible = false;
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
      if (this.planService.updateAllPlan) {
        this.getPlans();
        this.planService.updateAllPlan = false;
      }
    }, 1000);
  }
}
