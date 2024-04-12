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
  options1: any; // 货物分布饼图样式
  options2: any; // 生产商分布柱状图样式
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodService: GoodsService
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

  // 统计货物生产商的供货种类
  countManufacturerOccurrences(): { [key: string]: number } {
    const counts: { [key: string]: number } = {}; // 、
    this.goodss.forEach((goods) => {
      const manufacturer = goods.goodsManufacturer;
      counts[manufacturer] = counts[manufacturer]
        ? counts[manufacturer] + 1
        : 1;
    });
    return counts;
  }

  // 配置echarts样式
  setupChart(): void {
    // 记录生产商与供货种类
    const manufacturerCounts = this.countManufacturerOccurrences();
    const manufacturers = Object.keys(manufacturerCounts);
    const counts = Object.values(manufacturerCounts);

    // 统计结果降序排列
    const sortedData = manufacturers
      .map((manufacturer, index) => ({
        name: manufacturer,
        count: counts[index],
      }))
      .sort((a, b) => b.count - a.count);

    // 排序后的生产商名称和对应的数量
    const sortedManufacturers = sortedData.map((item) => item.name);
    const sortedCounts = sortedData.map((item) => item.count);

    // 配置柱状图样式
    this.options2 = {
      title: [
        {
          text: '生产商统计',
          left: 'center',
        },
      ],
      legend: {
        text: '生产商数量统计',
        top: 'bottom',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: sortedManufacturers, // 使用排序后的生产商名称
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: function (value: string) {
            // 每8个字符换行一次
            return value.replace(/(.{8})/g, '$1\n');
          },
        },
      },
      yAxis: { name: '供货种类' },
      series: [
        {
          type: 'bar',
          data: sortedCounts, // 使用排序后的生产商供货数量
        },
      ],
    };

    // 配置饼图样式
    this.options1 = {
      title: [
        {
          text: '货物统计',
          left: 'center',
        },
      ],
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
    // 每秒判断货物信息是否修改或新增
    setInterval(() => {
      if (this.goodService.afterModifyGoods) {
        this.goodService.afterModifyGoods = false;
        this.goodService.getAllGoods().subscribe((res) => {
          this.goodss = res;
          this.setupChart();
        });
      }
    }, 1000);
  }
}
