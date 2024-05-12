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
  // Variables related to filtering lists
  selectedOption: string = '入库';
  inboundDisplay: Inbound[] = []; // Initial inbound and outbound records
  outboundDisplay: Outbound[] = [];
  inboundTemp: Inbound[] = []; // Store the information before filtering
  outboundTemp: Outbound[] = [];
  visible = false;
  searchValue = '';
  popoverContent: string = '请点击'; //Goods details tooltip
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
  // Date filter
  startDate = '';
  endDate = '';
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private goodsService: GoodsService,
    private recordService: RecordService
  ) {}

  // Get inbound and outbound records
  getRecords(): void {
    this.recordService
      .getInboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.inboundDisplay = res.sort((a: Inbound, b: Inbound) => {
          // Sort in descending order based on ID
          return parseInt(b.inboundID) - parseInt(a.inboundID);
        });
      });

    this.recordService
      .getOutboundRecordByUserId(this.userService.loginID)
      .subscribe((res) => {
        this.outboundDisplay = res.sort((a: Outbound, b: Outbound) => {
          // Sort in descending order based on ID
          return parseInt(b.outboundID) - parseInt(a.outboundID);
        });
      });
  }

  // Search by order ID
  inboundSearch(): void {
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
        `已展示包含 入库单ID： ${this.searchValue} 的入库记录!`
      );
    else this.message.create('success', '已重置入库记录！');
  }

  outboundSearch(): void {
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
    else this.message.create('success', '已重置出库记录！');
  }

  // Inbound and outbound selector
  filterRecords(): any[] {
    if (this.selectedOption == '入库') {
      return this.inboundDisplay;
    } else if (this.selectedOption == '出库') {
      return this.outboundDisplay;
    } else {
      return [];
    }
  }

  // Filter records based on date range
  filterDate(start: string, end: string): void {
    this.inboundTemp = this.inboundDisplay;
    this.outboundTemp = this.outboundDisplay;
    let filteredInbound = this.inboundDisplay;
    let filteredOutbound = this.outboundDisplay;

    // If both the start date and end date are not empty, filter based on the date range.
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

    // Update the displayed records
    this.inboundDisplay = filteredInbound;
    this.outboundDisplay = filteredOutbound;
  }

  // Reset date range
  reset(): void {
    // If the previous record is empty, obtain all record information
    if (this.inboundTemp.length === 0 && this.outboundTemp.length === 0) {
      this.getRecords();
    } else {
      // Otherwise, restore the records before filtering
      this.inboundDisplay = this.inboundTemp;
      this.outboundDisplay = this.outboundTemp;
      this.inboundTemp = [];
      this.outboundTemp = [];
    }
  }

  // Display detailed information after clicking the goods name
  handleClick(GoodsID: string) {
    this.goodsService.getGoodsById(GoodsID).subscribe((data) => {
      this.goods = data;
      this.popoverContent = `
      货物名称: ${this.goods.goodsName}，
      货物规格: ${this.goods.goodsSpecification}，
      生产厂家: ${this.goods.goodsManufacturer}，
      生产许可证: ${this.goods.goodsProductionLicense}，
      库存数量: ${this.goods.goodsAmount}。
    `;
    });
  }
  // Goods information click tooltip
  clearPopoverContent(): void {
    this.popoverContent = '请点击';
  }

  ngOnInit(): void {
    this.getRecords();
  }
}
