import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from '../interfaces/goods';
import { GoodsService } from '../services/goods.service';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
})
export class GoodsComponent implements OnInit {
  goodss: Goods[] = [];
  options1: any; // 用户配置echarts样式
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodService: GoodsService
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

  // 配置echarts样式
  setupChart(): void {
    this.options1 = {
      legend: {
        text: '货物数量统计',
        top: 'bottom',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: '货物信息',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8,
          },
          data: this.goodss.map((goods) => ({
            value: goods.goodsAmount,
            name: `${goods.goodsSpecification} ${goods.goodsName}`,
          })),
        },
      ],
    };
  }

  ngOnInit(): void {
    this.goodService.getAllGoods().subscribe((res) => {
      this.goodss = res;
      this.setupChart();
    });
  }
}
