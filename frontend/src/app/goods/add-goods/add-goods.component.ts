import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from 'src/app/services/goods.service';

import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-goods',
  templateUrl: './add-goods.component.html',
  styleUrls: ['./add-goods.component.css'],
})
export class AddGoodsComponent implements OnInit {
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

  validateForm: FormGroup<{
    name: FormControl<string>;
    specification: FormControl<string>;
    manufacturer: FormControl<string>;
    productionLicense: FormControl<string>;
    unit: FormControl<string>;
    storageCondition: FormControl<string>;
  }>;

  // 获取新增货物的ID
  getNewGoodsID(): void {
    this.goodsService.getMaxGoodsID().subscribe((res) => {
      let numberID: number = +res;
      let IDPlus1: number = numberID + 1;
      this.goods.goodsID = IDPlus1.toString();
    });
  }

  submitForm(): void {
    // 将提交的值赋值给货物类型
    if (this.validateForm.valid) {
      this.goods.goodsName = this.validateForm.controls['name'].value;
      this.goods.goodsSpecification =
        this.validateForm.controls['specification'].value;
      this.goods.goodsManufacturer =
        this.validateForm.controls['manufacturer'].value;
      this.goods.goodsProductionLicense =
        this.validateForm.controls['productionLicense'].value;
      this.goods.goodsUnit = this.validateForm.controls['unit'].value;
      this.goods.goodsStorageCondition =
        this.validateForm.controls['storageCondition'].value;
      this.goods.goodsUpdatedByID = this.userService.loginID;

      // 确认创建货物的信息
      this.informationConfirm();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  informationConfirm(): void {
    // 确认创建信息提示框
    this.modal.confirm({
      nzTitle: '<i>请确认新货物信息!</i>',
      nzContent: `
    <p>ID：${this.goods.goodsID}</p>
    <p>名称：${this.goods.goodsName}</p>
    <p>规格：${this.goods.goodsSpecification}</p>
    <p>生产商：${this.goods.goodsManufacturer}</p>
    <p>生产许可证：${this.goods.goodsProductionLicense}</p>
    <p>单位：${this.goods.goodsUnit}</p>
    <p>储存条件：${this.goods.goodsStorageCondition}</p>`,
      nzOnOk: () => this.save(),
    });
  }

  // 提交创建信息
  save(): void {
    this.goodsService.addGoods(this.goods).subscribe((res) => {
      if (res == '0') {
        this.message.create('error', '货物已存在!');
        return;
      }
      this.message.create('success', '新增货物成功!');
      this.goodsService.afterModifyGoods = true; // 修改完成后在货物图表页刷新信息
      console.log('submit', this.goods);
      this.router.navigateByUrl('/index/goods/all'); // 跳转货物信息页
    });
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService,
    private userService: UserService,
    private message: NzMessageService,
    private router: Router,
    private goodsService: GoodsService
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      specification: ['', [Validators.required]],
      manufacturer: ['', [Validators.required]],
      productionLicense: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      storageCondition: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getNewGoodsID();
  }
}
