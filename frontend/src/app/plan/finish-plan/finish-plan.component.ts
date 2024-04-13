import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableFilterFn } from 'ng-zorro-antd/table';
import { Goods } from 'src/app/interfaces/goods';
import { Plan } from 'src/app/interfaces/plan';
import { GoodsService } from 'src/app/services/goods.service';
import { PlanService } from 'src/app/services/plan.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-finish-plan',
  templateUrl: './finish-plan.component.html',
  styleUrls: ['./finish-plan.component.css'],
})
export class FinishPlanComponent {
  plans: Plan[] = []; // 所有计划信息
  plansDisplay: {
    selected: boolean;
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = []; // 前端展示的计划信息
  plansSubmit: {
    selected: boolean;
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = [];
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  confirmVisible = false; // 确认出库对话框

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

  constructor(
    private planService: PlanService,
    private message: NzMessageService,
    private goodsService: GoodsService,
    private userService: UserService
  ) {}

  getPlans(): void {
    this.planService.getAllPlans().subscribe((res) => {
      this.plans = res;

      // 筛选出 planStatus 为 '未完成' 的计划
      const unfinishedPlans = this.plans.filter(
        (plan) => plan.planStatus === '未完成'
      );

      this.plansDisplay = unfinishedPlans.map((plan) => {
        return {
          selected: false,
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
        // 按照时间由近到远排序
        const timeA = new Date(a.plan.planExpectedTime).getTime();
        const timeB = new Date(b.plan.planExpectedTime).getTime();
        return timeA - timeB;
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

  // 重置搜索内容
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  showModal(): void {
    let hasSelectedGoods = false; // 判断是否有选择的商品
    // 检查是否有选择的商品
    this.plansDisplay.forEach((item) => {
      if (item.selected) {
        hasSelectedGoods = true;
      }
    });
    // 如果没有选择的商品，则显示错误消息
    if (!hasSelectedGoods) {
      this.message.create('error', '请选择计划');
      return;
    }

    // 准备要提交的商品信息
    this.plansSubmit = this.plansDisplay.filter((item) => item.selected);

    // 打开确认对话框
    this.confirmVisible = true;
  }

  // 使用JavaScript的Date对象解析日期时间字符串
  convertToGMTFormat(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    // 构建GMT格式的字符串
    const gmtDateString = date.toUTCString();
    return gmtDateString;
  }

  // 用户确认提交
  handleOk(): void {
    const date = new Date();
    this.plansSubmit.forEach((item) => {
      const plan: Plan = {
        planID: item.plan.planID,
        inOrOutbound: item.plan.inOrOutbound,
        planGoodsID: item.plan.planGoodsID,
        planExpectedTime: item.plan.planExpectedTime,
        planExpectedAmount: item.plan.planExpectedAmount,
        planStatus: '已完成',
        planUpdatedByID: item.plan.planUpdatedByID,
        planUpdatedTime: item.plan.planUpdatedTime,
        planFinishedByID: this.userService.loginID,
        planFinishedTime: '',
      };
      this.planService.finishPlan(plan).subscribe();
    });

    this.confirmVisible = false;
    this.planService.afterModifyPlan = true;
    this.planService.afterModifyLayout = true;
    this.message.create('success', '完成计划成功');
  }

  handleCancel(): void {
    this.confirmVisible = false;
    this.getPlans();
  }

  ngOnInit(): void {
    this.getPlans();
    setInterval(() => {
      if (this.planService.afterModifyPlan) {
        this.getPlans();
        this.planService.afterModifyPlan = false;
      }
    }, 1000);
  }
}
