import { Component, OnInit } from '@angular/core';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/interfaces/plan';

@Component({
  selector: 'app-out-plan',
  templateUrl: './out-plan.component.html',
  styleUrls: ['./out-plan.component.css'],
})
export class OutPlanComponent implements OnInit {
  goods: Goods[] = []; // Retrieve all goods information
  goodsDisplay: {
    goods: Goods;
    selected: boolean;
    outAmount: number;
    outDate: string;
  }[] = []; // Store the displayed goods information
  plansSubmit: {
    goods: Goods;
    selected: boolean;
    outAmount: number;
    outDate: string;
  }[] = []; // Store user-created outbound plans
  plans: Plan[] = []; // Submit outbound plans to the backend
  newPlanID = ''; // New outbound plan ID

  confirmVisible = false; // Confirmation dialog visiable

  constructor(
    private goodsService: GoodsService,
    private planService: PlanService,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  // Retrieve all goods information
  getGoods(): void {
    this.goodsService.getAllOutPlanGoods().subscribe((res) => {
      this.goods = res;
      this.goodsDisplay = this.goods.map((goods) => ({
        goods,
        selected: false,
        outAmount: 0,
        outDate: '',
      }));
    });
  }

  // Retrieve new outbound plan ID
  getPlanID(): void {
    this.planService.getMaxPlanID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
    });
  }

  showModal(): void {
    let hasSelectedGoods = false;
    this.goodsDisplay.forEach((item) => {
      if (item.selected) {
        hasSelectedGoods = true;
      }
    });
    // If no goods is selected, display error message
    if (!hasSelectedGoods) {
      this.message.create('error', '请选择要出库的货物');
      return;
    }
    let hasUnenteredAmount = false;
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.outAmount == 0) {
        hasUnenteredAmount = true;
      }
    });
    // If there are items with no input for the outbound quantity, display error message
    if (hasUnenteredAmount) {
      this.message.create('warning', '请输入货物的出库数量');
      return;
    }
    let hasUnenteredDate = false;
    let hasPastDate = false;
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.outDate == '') {
        hasUnenteredDate = true;
      } else if (item.selected && new Date(item.outDate) < new Date()) {
        hasPastDate = true;
      }
    });
    // If the selected merchandise has no input for the planned time, display error message
    if (hasUnenteredDate) {
      this.message.create('warning', '请输入预计出库时间');
      return;
    }
    //  If a past date is selected, display error message
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
        inOrOutbound: 'Outbound',
        planGoodsID: item.goods.goodsID,
        planExpectedTime: this.convertToGMTFormat(item.outDate),
        planExpectedAmount: item.outAmount,
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
    this.message.create('success', '新增出库计划成功');
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
