import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from 'src/app/services/goods.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-modify-goods',
  templateUrl: './modify-goods.component.html',
  styleUrls: ['./modify-goods.component.css'],
})
export class ModifyGoodsComponent implements OnInit {
  constructor(
    private goodsService: GoodsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private userService: UserService
  ) {}

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

  // 前端输入信息并点击保存后，弹出对话框确认信息
  saveConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>请确认货物修改后的信息！</i>',
      nzContent: `
      <p>名称：${this.goods.goodsName}</p>
      <p>规格：${this.goods.goodsSpecification}</p>
      <p>生产商：${this.goods.goodsManufacturer}</p>
      <p>生产许可证：${this.goods.goodsProductionLicense}</p>
      <p>单位：${this.goods.goodsUnit}</p>
      <p>储存条件：${this.goods.goodsStorageCondition}</p>`,
      nzOnOk: () => this.save(),
    });
    this.goods.goodsUpdatedByID = this.userService.loginID;
  }

  // 提交修改的信息到后端并返回
  save(): void {
    this.goodsService.updateGoods(this.goods).subscribe(() => this.goBack());
    this.message.create('success', '修改成功!');
  }

  goBack(): void {
    this.goodsService.modifyID = ''; // 修改完成后清除待修改货物的ID
    this.goodsService.afterModify = true; // 修改完成后在货物信息页刷新信息
    this.router.navigateByUrl('/index/goods/all');
  }

  // 开始时获取要修改的货物信息
  ngOnInit() {
    this.goodsService
      .getGoodsById(this.goodsService.modifyID)
      .subscribe((res) => {
        this.goods = res;
      });
  }
}
