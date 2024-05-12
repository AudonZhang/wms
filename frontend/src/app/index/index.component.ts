import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Plan } from '../interfaces/plan';
import { GoodsService } from '../services/goods.service';
import { PlanService } from '../services/plan.service';
import { Goods } from '../interfaces/goods';
import { RecordService } from '../services/record.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService,
    private goodsService: GoodsService,
    private recordsService: RecordService,
    private userService: UserService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }

  // Check if the current page is a subpage
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  // Some variables used in ECharts
  plansDisplay: {
    plan: Plan;
    goodsName: string;
    goodsSpecification: string;
    goodsManufacturer: string;
  }[] = [];
  goods: Goods[] = [];
  inboundData: {
    day: string;
    amount: string;
  }[] = [];
  outboundData: {
    day: string;
    amount: string;
  }[] = [];
  allGoodsAmount = 0;

  // Initialize ECharts configuration
  optionGoodsAmount: any;
  optionGoodsCategory: any;
  optionInventoryChange: any;
  optionUserStatus: any;

  // Fetch the displayed plan information
  getPlans(): void {
    this.planService.getAllPlans().subscribe((res) => {
      const plans: Plan[] = res;
      this.plansDisplay = plans.map((plan) => {
        return {
          plan: plan,
          goodsName: '',
          goodsSpecification: '',
          goodsManufacturer: '',
        };
      });
      // Fetch the goods information in each plan
      this.plansDisplay.forEach((planDisplay) => {
        this.goodsService
          .getGoodsById(planDisplay.plan.planGoodsID)
          .subscribe((goods) => {
            planDisplay.goodsName = goods.goodsName;
            planDisplay.goodsSpecification = goods.goodsSpecification;
            planDisplay.goodsManufacturer = goods.goodsManufacturer;
          });
      });

      // Sort by time
      this.plansDisplay.sort((a, b) => {
        const timeA = new Date(a.plan.planExpectedTime).getTime();
        const timeB = new Date(b.plan.planExpectedTime).getTime();
        return timeA - timeB;
      });
      // Filter unfinished plans
      this.plansDisplay = this.plansDisplay.filter(
        (planDisplay) => planDisplay.plan.planStatus === '未完成'
      );

      // Keep the first three plans
      this.plansDisplay = this.plansDisplay.slice(0, 3);
    });
  }

  // Count the quantity and types of goods
  getGoods(): void {
    this.goodsService.getAllGoods().subscribe((res) => {
      this.goods = res;
      this.allGoodsAmount = this.goods.reduce((total, current) => {
        return total + current.goodsAmount;
      }, 0);

      this.setupGoodsChart();
    });
  }

  setupGoodsChart(): void {
    const goodsCounts = this.countGoodsOccurrences();
    const categories = Object.keys(goodsCounts);
    const counts = Object.values(goodsCounts);

    const sortedData = categories
      .map((name, index) => ({
        name: name,
        count: counts[index],
      }))
      .sort((a, b) => b.count - a.count);

    const sortedCategories = sortedData.map((item) => item.name);
    const sortedCounts = sortedData.map((item) => item.count);

    this.optionGoodsCategory = {
      title: [
        {
          text: '货物统计',
          left: 'center',
        },
      ],
      grid: {
        x: 25,
        y: 45,
        x2: 5,
        y2: 30,
      },
      legend: {
        text: '货物数量统计',
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
        data: sortedCategories,
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: function (value: string) {
            // Wrap every 3 characters
            return value.replace(/(.{3})/g, '$1\n');
          },
        },
      },
      yAxis: { name: '货物数量' },
      series: [
        {
          type: 'bar',
          data: sortedCounts,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 10,
                },
              },
            },
          },
        },
      ],
    };

    this.optionGoodsAmount = {
      title: [
        {
          text: '仓库空间利用率',
          left: 'center',
        },
      ],
      series: [
        {
          type: 'gauge',
          progress: {
            show: true,
            width: 8,
          },
          axisLine: {
            lineStyle: {
              width: 8,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 5,
            lineStyle: {
              width: 1,
              color: '#999',
            },
          },
          axisLabel: {
            distance: 5,
            color: '#999',
            fontSize: 2,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 5,
            itemStyle: {
              borderWidth: 1,
            },
          },

          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '100%'],
            formatter: `{value}%`,
          },
          data: [
            {
              value: this.allGoodsAmount,
            },
          ],
        },
      ],
    };
  }

  // Count the quantity of goods
  countGoodsOccurrences(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.goods.forEach((goods) => {
      const name = goods.goodsName;
      counts[name] = counts[name]
        ? counts[name] + goods.goodsAmount
        : goods.goodsAmount;
    });
    return counts;
  }

  // Get the inbound and outbound information
  getInventory(): void {
    this.recordsService.getAllInbounds().subscribe((records) => {
      this.inboundData = this.aggregateByDayIn(records);
      this.recordsService.getAllOutbounds().subscribe((records) => {
        this.outboundData = this.aggregateByDayOut(records);
        this.setupChartInventoryChange(this.inboundData, this.outboundData);
      });
    });
  }

  // Count the inbound information for each day
  aggregateByDayIn(records: any[]): any[] {
    const aggregateData: { [key: string]: number } = {};
    records.forEach((records) => {
      const day = new Date(records.inboundUpdatedTime).toLocaleDateString(
        'zh-CN',
        { timeZone: 'UTC' }
      );
      if (aggregateData[day]) {
        aggregateData[day] += records.inboundAmount;
      } else {
        aggregateData[day] = records.inboundAmount;
      }
    });
    return Object.entries(aggregateData).map(([day, amount]) => ({
      day,
      amount,
    }));
  }

  // Count the outbound information for each day
  aggregateByDayOut(records: any[]): any[] {
    const aggregateData: { [key: string]: number } = {};
    records.forEach((records) => {
      const day = new Date(records.outboundUpdatedTime).toLocaleDateString(
        'zh-CN',
        { timeZone: 'UTC' }
      );
      if (aggregateData[day]) {
        aggregateData[day] += records.outboundAmount;
      } else {
        aggregateData[day] = records.outboundAmount;
      }
    });
    return Object.entries(aggregateData).map(([day, amount]) => ({
      day,
      amount,
    }));
  }

  setupChartInventoryChange(inboundData: any[], outboundData: any[]): void {
    // Merge the inbound and outbound dates, and sort by date
    const allDays = [
      ...inboundData.map((data) => data.day),
      ...outboundData.map((data) => data.day),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.optionInventoryChange = {
      title: {
        text: '吞吐量',
        left: 'center',
      },
      grid: {
        x: 25,
        y: 45,
        x2: 5,
        y2: 20,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['入库数量', '出库数量'],
        left: 'left',
      },
      xAxis: {
        type: 'category',
        data: allDays,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '入库数量',
          data: allDays.map((day) => {
            const foundData = inboundData.find((data) => data.day === day);
            return foundData ? foundData.amount : 0;
          }),
          type: 'line',
        },
        {
          name: '出库数量',
          data: allDays.map((day) => {
            const foundData = outboundData.find((data) => data.day === day);
            return foundData ? foundData.amount : 0;
          }),
          type: 'line',
        },
      ],
    };
  }

  // Count the user status
  getUsers(): void {
    this.userService.getAllUsers().subscribe((res) => {
      const onJobCount = res.filter(
        (user) => user.userStatus === '在职'
      ).length;
      const quitCount = res.filter((user) => user.userStatus === '离职').length;
      this.setupChartUsers(onJobCount, quitCount);
    });
  }

  setupChartUsers(onJobCount: number, quitCount: number): void {
    this.optionUserStatus = {
      title: {
        text: '员工在职情况',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '员工状态',
          type: 'pie',
          radius: '50%',
          data: [
            { value: onJobCount, name: '在职' },
            { value: quitCount, name: '离职' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  updateUserStatusChart(): void {
    this.userService.getAllUsers().subscribe((res) => {
      const onJobCount = res.filter(
        (user) => user.userStatus === '在职'
      ).length;
      const quitCount = res.filter((user) => user.userStatus === '离职').length;
      const updatedOptionUserStatus = {
        ...this.optionUserStatus,
        series: [
          {
            ...this.optionUserStatus.series[0],
            data: [
              { value: onJobCount, name: '在职' },
              { value: quitCount, name: '离职' },
            ],
          },
        ],
      };
      this.optionUserStatus = updatedOptionUserStatus;
    });
  }
  ngOnInit(): void {
    this.getPlans();
    this.getGoods();
    this.getInventory();
    this.getUsers();
  }
}
