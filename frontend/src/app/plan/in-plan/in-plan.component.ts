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
  goods: Goods[] = []; // 获取所有货物
  goodsDisplay: {
    goods: Goods;
    selected: boolean;
    inAmount: number;
    inDate: string;
  }[] = []; // 记录入库计划相关信息
  plansSubmit: {
    goods: Goods;
    selected: boolean;
    inAmount: number;
    inDate: string;
  }[] = []; // 记录入库计划相关信息
  plans: Plan[] = []; // 提交到后端的入库计划
  newPlanID = ''; // 新入库计划ID

  confirmVisible = false; // 确认入库对话框

  constructor(
    private goodsService: GoodsService,
    private planService: PlanService,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  // 获取货物信息
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

  // 获取新的计划ID
  getPlanID(): void {
    this.planService.getMaxPlanID().subscribe((res) => {
      let numberID: number = +res;
      // 将数字加一
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
    });
  }

  showModal(): void {
    let hasSelectedGoods = false; // 判断是否有选择的商品
    // 检查是否有选择的商品
    this.goodsDisplay.forEach((item) => {
      if (item.selected) {
        hasSelectedGoods = true;
      }
    });
    // 如果没有选择的商品，则显示错误消息
    if (!hasSelectedGoods) {
      this.message.create('error', '请选择要入库的商品');
      return;
    }
    let hasUnenteredAmount = false; // 判断是否有商品未输入入库数量
    // 如果存在选择的商品，则检查是否有商品未输入入库数量
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.inAmount == 0) {
        // 如果选择了商品但入库数量为零，则设置标志为true
        hasUnenteredAmount = true;
      }
    });
    // 如果有商品未输入入库数量，则显示错误消息
    if (hasUnenteredAmount) {
      this.message.create('warning', '请输入商品的入库数量');
      return;
    }
    let hasUnenteredDate = false; // 判断是否有商品未输入计划日期
    let hasPastDate = false; // 判断是否有选择过去的日期
    // 如果存在选择的商品，则检查是否有商品未输入入库数量
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.inDate == '') {
        // 如果选择了商品但入库数量为零，则设置标志为true
        hasUnenteredDate = true;
      } else if (item.selected && new Date(item.inDate) < new Date()) {
        // 如果选择了商品且选择的日期在过去，则设置标志为true
        hasPastDate = true;
      }
    });
    // 如果有商品未输入入库数量，则不显示对话框
    if (hasUnenteredDate) {
      this.message.create('warning', '请输入预计入库时间');
      return;
    }
    // 如果有选择过去的日期，则显示错误消息
    if (hasPastDate) {
      this.message.create('error', '请选择预计入库日期!');
      return;
    }
    // 准备要提交的商品信息
    this.plansSubmit = this.goodsDisplay.filter((item) => item.selected);

    // 打开确认对话框
    this.confirmVisible = true;
  }

  // 解析日期时间字符串
  convertToGMTFormat(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    // 构建GMT格式的字符串
    const gmtDateString = date.toUTCString();
    return gmtDateString;
  }

  // 用户确认提交
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
      // 将数字加一
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
      this.planService.addPlan(plan).subscribe(() => {
        console.log('submit', plan.planID);
      });
    });

    this.confirmVisible = false;
    this.planService.afterModifyPlan = true;
    this.planService.afterModifyPlan2 = true;
    this.planService.afterModifyLayout = true;
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
      if (this.planService.afterModifyPlan) {
        this.getGoods();
        this.getPlanID();
        this.planService.afterModifyPlan = false;
      }
    }, 1000);
  }
}
