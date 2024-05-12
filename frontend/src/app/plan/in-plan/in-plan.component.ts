import { Component, OnInit } from '@angular/core';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/interfaces/plan';

@Component({
  selector: 'app-in-plan',
  templateUrl: './in-plan.component.html',
  styleUrls: ['./in-plan.component.css'],
})
export class InPlanComponent implements OnInit {
  goods: Goods[] = []; // Store all goods information
  goodsDisplay: {
    goods: Goods;
    selected: boolean;
    inAmount: number;
    inDate: string;
  }[] = []; // Store goods that can be scheduled
  plansSubmit: {
    goods: Goods;
    selected: boolean;
    inAmount: number;
    inDate: string;
  }[] = []; // Store submitted inbound plans
  plans: Plan[] = []; // Submit inbound plans to the backend
  newPlanID = ''; // New inbound plan ID

  confirmVisible = false; // Confirmation dialog visiable

  constructor(
    private goodsService: GoodsService,
    private planService: PlanService,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  // Retrieve all goods information
  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      this.goods = res;
      this.goodsDisplay = this.goods.map((goods) => ({
        goods,
        selected: false,
        inAmount: 0,
        inDate: '',
      }));
    });
  }

  // Retrieve new plan ID
  getPlanID(): void {
    this.planService.getMaxPlanID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
    });
  }

  showModal(): void {
    let hasSelectedGoods = false; // Determine if there are selected goods
    this.goodsDisplay.forEach((item) => {
      if (item.selected) {
        hasSelectedGoods = true;
      }
    });
    // If no goods is selected, display error message
    if (!hasSelectedGoods) {
      this.message.create('error', '请选择要入库的货物');
      return;
    }
    let hasUnenteredAmount = false;
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.inAmount == 0) {
        hasUnenteredAmount = true;
      }
    });
    // If there are items with no input for the inbound quantity, display error message
    if (hasUnenteredAmount) {
      this.message.create('warning', '请输入货物的入库数量');
      return;
    }
    let hasUnenteredDate = false;
    let hasPastDate = false;
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.inDate == '') {
        hasUnenteredDate = true;
      } else if (item.selected && new Date(item.inDate) < new Date()) {
        hasPastDate = true;
      }
    });
    // If the selected goods has no input for the planned time, display error message
    if (hasUnenteredDate) {
      this.message.create('warning', '请输入预计入库时间');
      return;
    }
    // If a past date is selected, display error message
    if (hasPastDate) {
      this.message.create('error', '计划不能设定在过去！');
      return;
    }
    // Prepare plan information to be submitted
    this.plansSubmit = this.goodsDisplay.filter((item) => item.selected);

    this.confirmVisible = true;
  }

  // Convert date format
  convertToGMTFormat(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    date.setHours(date.getHours() + 8);
    const gmtDateString = date.toUTCString();
    return gmtDateString;
  }

  // User click "ok"
  handleOk(): void {
    this.plansSubmit.forEach((item) => {
      const plan: Plan = {
        planID: this.newPlanID,
        inOrOutbound: 'Inbound',
        planGoodsID: item.goods.goodsID,
        planExpectedTime: this.convertToGMTFormat(item.inDate),
        planExpectedAmount: item.inAmount,
        planStatus: '未完成',
        planUpdatedByID: this.userService.loginID,
        planUpdatedTime: '',
        planFinishedByID: '',
        planFinishedTime: '',
      };
      let numberID: number = +this.newPlanID;
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
      this.planService.addPlan(plan).subscribe(() => {
        console.log('submit', plan.planID);
      });
    });

    this.confirmVisible = false;
    this.planService.updateAllPlan = true;
    this.planService.updatePlan = true;
    this.planService.updateLayout = true;
    this.message.create('success', '新增入库计划成功');
  }

  handleCancel(): void {
    this.confirmVisible = false;
    this.getGoods();
  }

  ngOnInit(): void {
    this.getGoods();
    this.getPlanID();
    setInterval(() => {
      if (this.planService.updateAllPlan) {
        this.getGoods();
        this.getPlanID();
        this.planService.updateAllPlan = false;
      }
    }, 1000);
  }
}
