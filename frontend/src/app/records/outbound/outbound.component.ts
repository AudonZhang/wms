import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-outbound',
  templateUrl: './outbound.component.html',
  styleUrls: ['./outbound.component.css'],
})
export class OutboundComponent {
  goods: Goods[] = [];
  goodsDisplay: { goods: Goods; selected: boolean; outAmount: number }[] = [];
  searchValue = ''; // 搜索内容
  visible = false; // 搜索框是否可见

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService,
    private message: NzMessageService
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

  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      // 筛选出 amount 大于 0 的商品
      this.goods = res.filter((goods) => goods.goodsAmount > 0);
      this.goodsDisplay = this.goods.map((goods) => ({
        goods,
        selected: false,
        outAmount: 0,
      }));
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
