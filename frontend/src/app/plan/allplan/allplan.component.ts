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
  plans: Plan[] = []; // Store all plan information
  plansDisplay: {
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = []; // Store the displayed plan information
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
  searchValue = '';
  visible = false; // Search box visible
  userRole = '';
  confirmVisible = false; // Deletion confirmation dialog

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

  // Status filtering function
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
      // Get the goods information in each plan
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
        // Prioritize displaying unfinished plans
        if (a.plan.planStatus === '未完成' && b.plan.planStatus === '已完成') {
          return -1;
        } else if (
          a.plan.planStatus === '已完成' &&
          b.plan.planStatus === '未完成'
        ) {
          return 1;
        } else {
          // Display the ones closer to the present time first
          const timeA = new Date(a.plan.planExpectedTime).getTime();
          const timeB = new Date(b.plan.planExpectedTime).getTime();
          return timeA - timeB;
        }
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

  deletePlan(id: string): void {
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

  // Show deletion confirmation dialog
  showModal(): void {
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

  // Clear the search value
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
