import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
})
export class RootComponent implements OnInit, DoCheck {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
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

  users: User[] = []; // 所有用户
  // 一些与echarts相关的变量
  userCount?: number;
  maleCount?: number;
  femaleCount?: number;
  onJobCount?: number;
  quitCount?: number;
  warehouseAdminCount?: number;
  maintenanceCount?: number;
  options1: any;
  options2: any;
  options3: any;

  initCharts(): void {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res;
      this.maleCount = this.users.filter(
        (user) => user.userGender === '男'
      ).length;
      this.femaleCount = this.users.filter(
        (user) => user.userGender === '女'
      ).length;
      this.onJobCount = this.users.filter(
        (user) => user.userStatus === '在职'
      ).length;
      this.quitCount = this.users.filter(
        (user) => user.userStatus === '离职'
      ).length;
      this.warehouseAdminCount = this.users.filter(
        (user) => user.userRole === '管理员'
      ).length;
      this.maintenanceCount = this.users.filter(
        (user) => user.userRole === '仓库运维'
      ).length;

      // 在获取用户数据后，更新图表数据
      this.updateChartData();
    });
  }

  ngOnInit(): void {
    this.initCharts();
  }

  ngDoCheck(): void {
    if (this.userService.updateRoot) {
      this.initCharts();
      this.userService.updateRoot = false;
    }
  }

  // echarts配置
  updateChartData(): void {
    this.userCount = this.users.length;
    this.options1 = {
      title: {
        text: '性别统计',
        left: 'center',
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: ['女', '男'],
      },
      series: [
        {
          data: [this.femaleCount, this.maleCount],
          type: 'bar',
        },
      ],
    };
    this.options2 = {
      title: {
        text: '在职情况',
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
            { value: this.onJobCount, name: '在职' },
            { value: this.quitCount, name: '离职' },
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
    this.options3 = {
      title: {
        text: '职务统计',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '10%',
        left: 'center',
      },
      series: [
        {
          name: '员工职务',
          type: 'pie',
          radius: ['25%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: this.warehouseAdminCount, name: '管理员' },
            { value: this.maintenanceCount, name: '仓库运维' },
          ],
        },
      ],
    };
  }
}
