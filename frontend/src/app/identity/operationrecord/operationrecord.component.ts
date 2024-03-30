import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Goods } from 'src/app/interfaces/goods';
import { Inbound } from 'src/app/interfaces/inbound';
import { Outbound } from 'src/app/interfaces/outbound';
import { GoodsService } from 'src/app/services/goods.service';
import { RecordService } from 'src/app/services/record.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-operationrecord',
  templateUrl: './operationrecord.component.html',
  styleUrls: ['./operationrecord.component.css'],
})
export class OperationrecordComponent implements OnInit {
  // 筛选列表选项
  selectedOption: string = '入库';
  inbound: Inbound[] = [];
  inboundDisplay: Inbound[] = [];
  outbound: Outbound[] = [];
  outboundDisplay: Outbound[] = [];
  visible = false;
  searchValue = '';
  popoverContent: string = '请点击'; //货物详情提示框
  goods: Goods = {
    goodsID: '',
    goodsName: '',
    goodsSpecification: '',
    goodsManufacturer: '',
    goodsProductionLicense: '',
    goodsUnit: '',
    goodsAmount: 0,
    goodsStorageCondition: '',
    goodsCreatedByID: '',
    goodsCreatedTime: '',
  };
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private goodsService: GoodsService,
    private recordService: RecordService
  ) {}

  inboundSearch(): void {
    this.visible = false;
    this.inboundDisplay = this.inbound.filter(
      (item: Inbound) =>
        item.inboundOrderID.toString().indexOf(this.searchValue) !== -1
    );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示包含入库单ID： ${this.searchValue} 的入库记录!`
      );
    else this.message.create('success', '已重置入库记录！');
  }

  inboundReset(): void {
    // 重置搜索内容
    this.searchValue = '';
    this.inboundSearch();
  }

  outboundSearch(): void {
    this.visible = false;
    this.outboundDisplay = this.outbound.filter(
      (item: Outbound) =>
        item.outboundOrderID.toString().indexOf(this.searchValue) !== -1
    );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示包含出库单ID： ${this.searchValue} 的出库记录!`
      );
    else this.message.create('success', '已重置出库单列表！');
  }

  outboundReset(): void {
    // 重置搜索内容
    this.searchValue = '';
    this.outboundSearch();
  }

  filterRecords(): any[] {
    if (this.selectedOption == '入库') {
      return this.inboundDisplay;
    } else if (this.selectedOption == '出库') {
      return this.outboundDisplay;
    } else {
      return [];
    }
  }

  handleClick(GoodsID: string) {
    this.goodsService.getGoodsById(GoodsID).subscribe((data) => {
      this.goods = data;
      this.popoverContent = `
      商品名称: ${this.goods.goodsName}，
      商品规格: ${this.goods.goodsSpecification}，
      生产厂家: ${this.goods.goodsManufacturer}，
      生产许可证: ${this.goods.goodsProductionLicense}，
      库存数量: ${this.goods.goodsAmount}。
    `;
    });
  }
  clearPopoverContent(): void {
    this.popoverContent = '请点击';
  }

  ngOnInit(): void {
    this.recordService
      .getInboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.inboundDisplay = res.sort((a: Inbound, b: Inbound) => {
          // 时间近的排在前面
          return (
            new Date(b.inboundCreatedTime).getTime() -
            new Date(a.inboundCreatedTime).getTime()
          );
        });
        this.inbound = this.inboundDisplay;
      });
    this.recordService
      .getOutboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.outboundDisplay = res.sort((a: Outbound, b: Outbound) => {
          // 时间近的排在前面
          return (
            new Date(b.outboundCreatedTime).getTime() -
            new Date(a.outboundCreatedTime).getTime()
          );
        });
        this.outbound = this.outboundDisplay;
      });
  }
}
