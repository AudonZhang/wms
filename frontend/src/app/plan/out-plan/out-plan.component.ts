import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/interfaces/plan';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-out-plan',
  templateUrl: './out-plan.component.html',
  styleUrls: ['./out-plan.component.css'],
})
export class OutPlanComponent implements OnInit {
  goods: Goods[] = []; // 获取所有无出库计划的货物
  goodsDisplay: {
    goods: Goods;
    selected: boolean;
    outAmount: number;
    outDate: string;
  }[] = []; // 记录出库计划相关信息
  plansSubmit: {
    goods: Goods;
    selected: boolean;
    outAmount: number;
    outDate: string;
  }[] = []; // 记录出库计划相关信息
  plans: Plan[] = []; // 提交到后端的出库计划
  newPlanID = ''; // 新出库计划ID
  // searchValue = ''; // 搜索内容
  // visible = false; // 搜索框是否可见
  confirmVisible = false; // 确认出库对话框

  constructor(
    private goodsService: GoodsService,
    private planService: PlanService,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  // 获取货物信息
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

  // 获取新的计划ID
  getPlanID(): void {
    this.planService.getMaxPlanID().subscribe((res) => {
      let numberID: number = +res;
      // 将数字加一
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
    });
  }

  // 重置搜索内容
  // reset(): void {
  //   this.searchValue = '';
  //   this.search();
  // }

  // // 根据货物名搜索
  // search(): void {
  //   this.visible = false;
  //   this.goodsDisplay = this.goods
  //     .map((goods) => ({ goods, selected: false, outAmount: 0 }))
  //     .filter(
  //       (item: { goods: Goods; selected: boolean }) =>
  //         item.goods.goodsName.indexOf(this.searchValue) !== -1
  //     );
  //   if (this.searchValue != '')
  //     this.message.create(
  //       'success',
  //       `已展示所有名字包含 ${this.searchValue} 的货物信息!`
  //     );
  //   else this.message.create('success', '已重置货物列表！');
  // }

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
      this.message.create('error', '请选择要出库的商品');
      return;
    }
    let hasUnenteredAmount = false; // 判断是否有商品未输入出库数量
    // 如果存在选择的商品，则检查是否有商品未输入出库数量
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.outAmount == 0) {
        // 如果选择了商品但出库数量为零，则设置标志为true
        hasUnenteredAmount = true;
      }
    });
    // 如果有商品未输入出库数量，则不显示对话框
    if (hasUnenteredAmount) {
      this.message.create('warning', '请输入商品的出库数量');
      return;
    }
    let hasUnenteredDate = false; // 判断是否有商品未输入计划日期
    // 如果存在选择的商品，则检查是否有商品未输入出库数量
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.outDate == '') {
        // 如果选择了商品但出库数量为零，则设置标志为true
        hasUnenteredDate = true;
      }
    });
    // 如果有商品未输入出库数量，则不显示对话框
    if (hasUnenteredDate) {
      this.message.create('warning', '请输入预计出库时间');
      return;
    }
    // 准备要提交的商品信息
    this.plansSubmit = this.goodsDisplay.filter((item) => item.selected);

    // 打开确认对话框
    this.confirmVisible = true;
  }

  convertToGMTFormat(dateTimeString: string): string {
    // 使用JavaScript的Date对象解析日期时间字符串
    const date = new Date(dateTimeString);

    // 构建GMT格式的字符串
    const gmtDateString = date.toUTCString();

    return gmtDateString;
  }

  // // 用户确认提交
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
      // 将数字加一
      let IDPlus1: number = numberID + 1;
      this.newPlanID = IDPlus1.toString();
      this.planService.addPlan(plan).subscribe(() => {
        console.log('submit', plan.planID);
      });
    });

    this.confirmVisible = false;
    this.planService.afterAddOutPlan = true;
    this.planService.afterModifyLayout = true;
    this.message.create('success', '新增出库计划成功');
  }

  handleCancel(): void {
    this.confirmVisible = false;
    this.getGoods();
  }

  ngOnInit(): void {
    this.getGoods();
    this.getPlanID();
    // 每秒获取是否已修改货物信息，若已修改则刷新货物信息列表并下载出库单
    setInterval(() => {
      if (this.planService.afterAddOutPlan) {
        this.getGoods();
        this.getPlanID();
        this.planService.afterAddOutPlan = false;
      }
    }, 1000);
  }
}
