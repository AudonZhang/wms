import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Goods } from 'src/app/interfaces/goods';
import { Inbound } from 'src/app/interfaces/inbound';
import { Outbound } from 'src/app/interfaces/outbound';
import { GoodsService } from 'src/app/services/goods.service';
import { RecordService } from 'src/app/services/record.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-allbound',
  templateUrl: './allbound.component.html',
  styleUrls: ['./allbound.component.css'],
})
export class AllboundComponent implements OnInit {
  // Filter list-related variables
  selectedOption: string = '入库';
  // Initial inbound and outbound records
  inboundDisplay: Inbound[] = [];
  outboundDisplay: Outbound[] = [];
  // Store the results before filtering
  inboundTemp: Inbound[] = [];
  outboundTemp: Outbound[] = [];
  visible = false;
  searchValue = '';
  popoverContent: string = '请点击'; //Item details tooltip
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
  startDate = ''; // Date filtering
  endDate = '';
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private goodsService: GoodsService,
    private recordService: RecordService
  ) {}

  // Retrieve inbound and outbound records
  getRecords(): void {
    this.recordService.getAllInbounds().subscribe((res) => {
      this.inboundDisplay = res.sort((a: Inbound, b: Inbound) => {
        // Sort in descending order by ID
        return parseInt(b.inboundID) - parseInt(a.inboundID);
      });
    });

    this.recordService.getAllOutbounds().subscribe((res) => {
      this.outboundDisplay = res.sort((a: Outbound, b: Outbound) => {
        // Sort in descending order by ID
        return parseInt(b.outboundID) - parseInt(a.outboundID);
      });
    });
  }

  // Search by inbound ID
  inboundSearch(): void {
    // Store the display content before searching
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
    // Store the display content before searching
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

  // Inbound and outbound record selector
  filterRecords(): any[] {
    if (this.selectedOption == '入库') {
      return this.inboundDisplay;
    } else if (this.selectedOption == '出库') {
      return this.outboundDisplay;
    } else {
      return [];
    }
  }

  // Filter records by date range
  filterDate(start: string, end: string): void {
    this.inboundTemp = this.inboundDisplay;
    this.outboundTemp = this.outboundDisplay;
    let filteredInbound = this.inboundDisplay;
    let filteredOutbound = this.outboundDisplay;

    // If both start date and end date are not empty, filter records by date range
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

    // Update display content
    this.inboundDisplay = filteredInbound;
    this.outboundDisplay = filteredOutbound;
  }

  // Reset display content
  reset(): void {
    // If Temp records are empty after resetting, directly obtain initial records
    if (this.inboundTemp.length === 0 && this.outboundTemp.length === 0) {
      this.getRecords();
    } else {
      // Otherwise, restore records before filtering
      this.inboundDisplay = this.inboundTemp;
      this.outboundDisplay = this.outboundTemp;
      this.inboundTemp = [];
      this.outboundTemp = [];
    }
  }

  // Display detailed information after clicking on the item name
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
  // Display user information after clicking on the ID name
  handleClick1(userID: string) {
    this.userService.getUserById(userID).subscribe((data) => {
      this.popoverContent = `
      用户姓名: ${data.userName}，
      用户职务: ${data.userRole}，
      用户状态: ${data.userStatus}，
      用户电话: ${data.userPhone}。
    `;
    });
  }
  // Information click tooltip
  clearPopoverContent(): void {
    this.popoverContent = '请点击';
  }
  ngOnInit(): void {
    this.getRecords();
  }
}
