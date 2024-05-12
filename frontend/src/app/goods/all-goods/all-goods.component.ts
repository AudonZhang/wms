import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from 'src/app/interfaces/goods';
import { GoodsService } from '../../services/goods.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-all-goods',
  templateUrl: './all-goods.component.html',
  styleUrls: ['./all-goods.component.css'],
})
export class AllGoodsComponent implements OnInit, DoCheck {
  goods: Goods[] = [];
  goodsDisplay: Goods[] = []; // Store the results after searching
  searchValue = ''; // Search content
  visible = false; // Search box visible
  userRole = '';
  // Sort by the quantity of goods
  sortFn: NzTableSortFn<Goods> = (a: Goods, b: Goods) =>
    a.goodsAmount - b.goodsAmount;
  sortDirections: NzTableSortOrder[] = ['ascend', 'descend', null];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService,
    private message: NzMessageService,
    private userService: UserService
  ) {
    // When entering the subpage, the content of that page is not displayed.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  // Fetch all goods information
  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      this.goods = res;
      this.goodsDisplay = this.goods;
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

  // Save the ID of the goods to be modified
  setModifyGoodsID(goodsID: string): void {
    this.goodsService.modifyID = goodsID;
  }

  ngOnInit(): void {
    this.getGoods();
    this.userRole = this.userService.loginRole;
  }

  // If the goods information has been modified, refresh the list of goods information.
  ngDoCheck(): void {
    if (this.goodsService.afterModify) {
      this.getGoods();
      this.goodsService.afterModify = false;
    }
  }
}
