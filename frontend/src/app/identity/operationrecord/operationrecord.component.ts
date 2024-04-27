import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  inboundDisplay: Inbound[] = []; // 初始出入库记录
  outboundDisplay: Outbound[] = [];
  inboundTemp: Inbound[] = []; // 储存筛选前的结果
  outboundTemp: Outbound[] = [];
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
    goodsUpdatedByID: '',
    goodsUpdatedTime: '',
  };
  startDate = ''; // 日期筛选
  endDate = '';
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private goodsService: GoodsService,
    private recordService: RecordService
  ) {}

  // 获取出入库记录
  getRecords(): void {
    this.recordService
      .getInboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.inboundDisplay = res.sort((a: Inbound, b: Inbound) => {
          // 入库记录根据ID降序排列
          return parseInt(b.inboundID) - parseInt(a.inboundID);
        });
      });

    this.recordService
      .getOutboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.outboundDisplay = res.sort((a: Outbound, b: Outbound) => {
          // 出库记录根据ID降序排列
          return parseInt(b.outboundID) - parseInt(a.outboundID);
        });
      });
  }

  // 根据入库单ID搜索
  inboundSearch(): void {
    // 储存搜索前的展示内容
    this.inboundTemp = this.inboundDisplay;
    this.outboundTemp = this.outboundDisplay;
    this.visible = false;
    this.inboundDisplay = this.inboundDisplay.filter(
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

  outboundSearch(): void {
    // 储存搜索前的展示内容
    this.inboundTemp = this.inboundDisplay;
    this.outboundTemp = this.outboundDisplay;
    this.visible = false;
    this.outboundDisplay = this.outboundDisplay.filter(
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

  // 出入库记录选择器
  filterRecords(): any[] {
    if (this.selectedOption == '入库') {
      return this.inboundDisplay;
    } else if (this.selectedOption == '出库') {
      return this.outboundDisplay;
    } else {
      return [];
    }
  }

  // 根据日期范围筛选记录
  filterDate(start: string, end: string): void {
    this.inboundTemp = this.inboundDisplay;
    this.outboundTemp = this.outboundDisplay;
    let filteredInbound = this.inboundDisplay;
    let filteredOutbound = this.outboundDisplay;

    // 如果起始日期和结束日期都不为空，则根据日期范围进行筛选
    if (this.startDate && this.endDate) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      filteredInbound = filteredInbound.filter((record) => {
        const recordDate = new Date(record.inboundUpdatedTime);
        return recordDate >= startDate && recordDate <= endDate;
      });

      filteredOutbound = filteredOutbound.filter((record) => {
        const recordDate = new Date(record.outboundUpdatedTime);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // 更新显示的记录
    this.inboundDisplay = filteredInbound;
    this.outboundDisplay = filteredOutbound;
  }

  // 重置日期范围
  reset(): void {
    // 若筛选日期加时间，重置一次后Temp记录为空，直接获得初始记录
    if (this.inboundTemp.length === 0 && this.outboundTemp.length === 0) {
      this.getRecords();
    } else {
      // 否则恢复筛选前的记录
      this.inboundDisplay = this.inboundTemp;
      this.outboundDisplay = this.outboundTemp;
      this.inboundTemp = [];
      this.outboundTemp = [];
    }
  }

  // 点击商品名称后显示详细信息
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
  // 商品信息点击提示
  clearPopoverContent(): void {
    this.popoverContent = '请点击';
  }

  ngOnInit(): void {
    this.getRecords();
  }
}
