import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { RecordService } from 'src/app/services/record.service';
import { Outbound } from 'src/app/interfaces/outbound';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-outbound',
  templateUrl: './outbound.component.html',
  styleUrls: ['./outbound.component.css'],
})
export class OutboundComponent implements OnInit {
  goods: Goods[] = [];
  goodsDisplay: { goods: Goods; selected: boolean; outAmount: number }[] = []; // 记录选中的货物与出库数量
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见
  confirmVisible = false; // 确认出库对话框
  submittedGoods: Goods[] = []; // 出库后的货物信息
  outboundOrderID = ''; // 出库对应新出库单ID
  oldOrderID = ''; // 更新前的出库单ID
  outboundID = ''; // 出库记录ID

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService,
    private message: NzMessageService,
    private userService: UserService,
    private recordService: RecordService,
    private http: HttpClient
  ) {
    // 进入子页面修改用户信息时，不显示该页面内容
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  // 获取可以出库的货物的信息
  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      // 筛选出数量大于 0 的货物
      this.goods = res.filter((goods) => goods.goodsAmount > 0);
      this.goodsDisplay = this.goods.map((goods) => ({
        goods,
        selected: false,
        outAmount: 0,
      }));
    });
  }

  // 获取新的出库记录ID
  getOutboundID(): void {
    this.recordService.getMaxOutboundID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.outboundID = IDPlus1.toString();
    });
  }

  // 货物新的出库单ID
  getOutboundOrderID(): void {
    this.recordService.getMaxOutboundOrderID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.outboundOrderID = IDPlus1.toString();
    });
  }

  // 重置搜索内容
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  // 根据货物名搜索
  search(): void {
    this.visible = false;
    this.goodsDisplay = this.goods
      .map((goods) => ({ goods, selected: false, outAmount: 0 }))
      .filter(
        (item: { goods: Goods; selected: boolean }) =>
          item.goods.goodsName.indexOf(this.searchValue) !== -1
      );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示所有名字包含 ${this.searchValue} 的货物信息!`
      );
    else this.message.create('success', '已重置货物列表！');
  }

  showModal(): void {
    let hasSelectedGoods = false; // 用于判断是否有选择的货物

    // 检查是否有选择的货物
    this.goodsDisplay.forEach((item) => {
      if (item.selected) {
        hasSelectedGoods = true;
      }
    });

    // 如果没有选择的货物，则显示错误消息
    if (!hasSelectedGoods) {
      this.message.create('error', '请选择要出库的货物');
      return;
    }

    let hasUnenteredAmount = false; // 用于判断是否有被选择的货物未输入出库数量

    // 则被选择的货物是否有输入出库数量
    this.goodsDisplay.forEach((item) => {
      if (item.selected && item.outAmount == 0) {
        hasUnenteredAmount = true;
      }
    });

    // 如果有货物未输入出库数量，则不显示对话框
    if (hasUnenteredAmount) {
      this.message.create('warning', '请输入货物的出库数量');
      return;
    }

    // 计算货物的剩余数量并准备要提交的货物信息
    this.submittedGoods = this.goodsDisplay
      .filter((item) => {
        if (item.selected && item.outAmount > 0) {
          item.goods.goodsAmount -= item.outAmount;
          return true; // 保留选中且有出库数量的货物
        }
        return false; // 过滤掉未选中或无出库数量的货物
      })
      .map((item) => item.goods);

    // 打开确认对话框
    this.confirmVisible = true;
  }

  // 用户确认提交
  handleOk(): void {
    this.submittedGoods.forEach((goods) => {
      goods.goodsUpdatedByID = this.userService.loginID;
      this.goodsService.outGoods(goods).subscribe();
    });
    this.goodsDisplay.forEach((item) => {
      if (item.selected) {
        const outbound: Outbound = {
          outboundID: this.outboundID,
          outboundOrderID: this.outboundOrderID,
          outboundGoodsID: item.goods.goodsID,
          outboundAmount: item.outAmount,
          outboundUpdatedByID: this.userService.loginID,
          outboundUpdatedTime: '', // 后端负责设置时间
        };
        let numberID: number = +this.outboundID;
        let IDPlus1: number = numberID + 1;
        this.outboundID = IDPlus1.toString();

        this.recordService.addOutbound(outbound).subscribe(() => {});
      }
    });
    this.oldOrderID = this.outboundOrderID;
    this.confirmVisible = false;
    this.recordService.afterModifyOut = true;
    this.recordService.afterModifyChart = true;
  }

  downloadOutboundOrder(): void {
    console.log('生成出库单', this.outboundOrderID);
    this.recordService.downloadOutboundOrder(
      this.oldOrderID,
      this.userService.loginID,
      this.userService.loginName,
      new Date()
    );
    this.oldOrderID = '';
  }
  handleCancel(): void {
    this.confirmVisible = false;
    this.getGoods();
  }

  ngOnInit(): void {
    this.getGoods();
    this.getOutboundID();
    this.getOutboundOrderID();

    // 每秒获取是否已修改货物信息，若已修改则刷新货物信息列表并下载出库单
    setInterval(() => {
      if (this.recordService.afterModifyOut) {
        this.getGoods();
        this.getOutboundID();
        this.getOutboundOrderID();
        this.downloadOutboundOrder();
        this.message.create('success', `浏览器已下载出库单！`);
        this.recordService.afterModifyOut = false;
      }
    }, 1000);
  }
}
