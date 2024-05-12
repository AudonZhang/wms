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
  goodsDisplay: { goods: Goods; selected: boolean; outAmount: number }[] = []; // Record selected goods and outbound quantity
  searchValue = '';
  visible = false; // Search box visible
  confirmVisible = false; // Confirmation dialog visible
  submittedGoods: Goods[] = []; // Outbound goods information
  outboundOrderID = ''; // New outbound order ID
  oldOrderID = ''; // Previous outbound plan ID before update
  outboundID = ''; // Outbound record ID

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService,
    private message: NzMessageService,
    private userService: UserService,
    private recordService: RecordService,
    private http: HttpClient
  ) {
    // When entering the subpage, do not display the content of that page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  // Retrieve information of goods available for outbound
  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      // Filter goods with quantity greater than 0
      this.goods = res.filter((goods) => goods.goodsAmount > 0);
      this.goodsDisplay = this.goods.map((goods) => ({
        goods,
        selected: false,
        outAmount: 0,
      }));
    });
  }

  // Retrieve new outbound record ID
  getOutboundID(): void {
    this.recordService.getMaxOutboundID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.outboundID = IDPlus1.toString();
    });
  }

  // Retrieve new outbound order ID
  getOutboundOrderID(): void {
    this.recordService.getMaxOutboundOrderID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.outboundOrderID = IDPlus1.toString();
    });
  }

  // Clear the search value
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  // Search by goods name
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

    // If there are items without input for the outbound quantity, display error message
    if (hasUnenteredAmount) {
      this.message.create('warning', '请输入货物的出库数量');
      return;
    }

    // Calculate remaining quantity of outbound goods and prepare goods information to be submitted
    this.submittedGoods = this.goodsDisplay
      .filter((item) => {
        if (item.selected && item.outAmount > 0) {
          item.goods.goodsAmount -= item.outAmount;
          return true; // Keep selected goods with input for outbound quantity
        }
        return false;
      })
      .map((item) => item.goods);

    this.confirmVisible = true;
  }

  // User click "ok"
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
          outboundUpdatedTime: '', // The backend Flask is responsible for setting the time
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

    // Every second, check if goods information has been modified. If modified, refresh the goods information list and download the outbound order.
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
