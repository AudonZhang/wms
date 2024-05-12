import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableFilterFn } from 'ng-zorro-antd/table';
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
  plans: Plan[] = []; // Store all plan information
  plansDisplay: {
    selected: boolean;
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = []; // Store the displayed plan information
  plansSubmit: {
    selected: boolean;
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = [];
  searchValue = '';
  visible = false; // Search box visible
  confirmVisible = false; // Confirmation dialog visiable

  // Inbound and outbound filtering function
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
      // Filter unfinished plans
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

      // Get detailed goods information in each plan
      this.plansDisplay.forEach((planDisplay) => {
        this.goodsService
          .getGoodsById(planDisplay.plan.planGoodsID)
          .subscribe((goods) => {
            planDisplay.goodsName = goods.goodsName;
            planDisplay.goodsManufacturer = goods.goodsManufacturer;
            planDisplay.goodsSpecification = goods.goodsSpecification;
          });
      });

      this.plansDisplay.sort((a, b) => {
        // Display the ones closer to the present time first
        const timeA = new Date(a.plan.planExpectedTime).getTime();
        const timeB = new Date(b.plan.planExpectedTime).getTime();
        return timeA - timeB;
      });
    });
  }

  // Search by goods name
  search(): void {
    this.visible = false;
    if (this.searchValue !== '') {
      this.plansDisplay = this.plansDisplay.filter((item) =>
        item.goodsName.includes(this.searchValue)
      );
      this.message.create(
        'success',
        `已展示所有包含 "${this.searchValue}" 的计划信息!`
      );
    } else {
      // If the search value is empty, reset the plan list
      this.getPlans();
      this.message.create('success', '已重置计划列表！');
    }
  }

  // Clear the search value
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  showModal(): void {
    let hasSelectedPlans = false; // Determine if there are selected plans
    this.plansDisplay.forEach((item) => {
      if (item.selected) {
        hasSelectedPlans = true;
      }
    });
    // Show error message
    if (!hasSelectedPlans) {
      this.message.create('error', '请选择计划');
      return;
    }
    this.plansSubmit = this.plansDisplay.filter((item) => item.selected);

    // Open confirmation dialog box
    this.confirmVisible = true;
  }

  // The user clicks "OK"
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
    this.planService.updateAllPlan = true;
    this.planService.updatePlan = true;
    this.planService.updateLayout = true;
    this.message.create('success', '计划完成');
  }

  handleCancel(): void {
    this.confirmVisible = false;
    this.getPlans();
  }

  ngOnInit(): void {
    this.getPlans();
    setInterval(() => {
      if (this.planService.updateAllPlan) {
        this.getPlans();
        this.planService.updateAllPlan = false;
      }
    }, 1000);
  }
}
