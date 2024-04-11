import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-all-goods',
  templateUrl: './all-goods.component.html',
  styleUrls: ['./all-goods.component.css'],
})
export class AllGoodsComponent implements OnInit {
  goods: Goods[] = [];
  goodsDisplay: Goods[] = []; // 搜索后展示内容列表
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService,
    private message: NzMessageService
  ) {
    // 进入子页面时，不显示该页面内容
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  // 获取所有货物信息
  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      this.goods = res;
      this.goodsDisplay = this.goods;
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
    this.goodsDisplay = this.goods.filter(
      (item: Goods) => item.goodsName.indexOf(this.searchValue) !== -1
    );
    if (this.searchValue != '')
      this.message.create(
        'success',
        `已展示所有名字包含 ${this.searchValue} 的货物信息!`
      );
    else this.message.create('success', '已重置货物列表！');
  }

  // 保存需要修改的货物ID，跳转后的组件可根据此获得对应货物信息
  setModifyGoodsID(goodsID: string): void {
    this.goodsService.modifyID = goodsID;
  }

  ngOnInit(): void {
    this.getGoods();

    // 每秒获取是否已修改货物信息，若已修改则刷新货物信息列表
    setInterval(() => {
      if (this.goodsService.afterModify) {
        this.goodsService.afterModify = false;
        this.getGoods();
      }
    }, 1000);
  }
}
