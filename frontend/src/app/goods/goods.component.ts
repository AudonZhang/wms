import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Goods } from '../interfaces/goods';
import { GoodsService } from '../services/goods.service';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
})
export class GoodsComponent implements OnInit, DoCheck {
  goodss: Goods[] = [];
  options1: any; // Goods statistics pie chart
  options2: any; // Manufacturer statistics bar chart
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodService: GoodsService
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

  // Statistic the types of goods supplied by manufacturers
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

  // ECharts style
  setupChart(): void {
    const manufacturerCounts = this.countManufacturerOccurrences();
    const manufacturers = Object.keys(manufacturerCounts);
    const counts = Object.values(manufacturerCounts);

    // Descending order
    const sortedData = manufacturers
      .map((manufacturer, index) => ({
        name: manufacturer,
        count: counts[index],
      }))
      .sort((a, b) => b.count - a.count);

    const sortedManufacturers = sortedData.map((item) => item.name);
    const sortedCounts = sortedData.map((item) => item.count);

    // Configure style
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
        data: sortedManufacturers,
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: function (value: string) {
            // Wrap every 8 characters
            return value.replace(/(.{8})/g, '$1\n');
          },
        },
      },
      yAxis: { name: '供货种类' },
      series: [
        {
          type: 'bar',
          data: sortedCounts,
        },
      ],
    };

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
  }

  // Update the chart after the goods information changes
  ngDoCheck(): void {
    if (this.goodService.afterModifyGoods) {
      this.goodService.getAllGoods().subscribe((res) => {
        this.goodss = res;
        this.setupChart();
        this.goodService.afterModifyGoods = false;
      });
    }
  }
}
