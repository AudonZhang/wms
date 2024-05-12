import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { filter } from 'rxjs';
import { Plan } from '../interfaces/plan';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
})
export class PlanComponent implements OnInit {
  plans: Plan[] = [];
  totalPlansCount?: number;
  inboundPlansCount?: number;
  outboundPlansCount?: number;
  completedPlansCount?: number;
  pendingPlansCount?: number;
  options1: any; // Inventory plan quantity statistics chart
  options2: any; // Plan status statistics chart
  options3: any; // Line chart of inbound and outbound plan quantity and time
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService
  ) {
    // When entering the subpage, do not display the content of that page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }

  getData(): void {
    this.planService.getAllPlans().subscribe((plans) => {
      this.plans = plans;
      this.inboundPlansCount = plans.filter(
        (plan) => plan.inOrOutbound === 'Inbound'
      ).length;
      this.outboundPlansCount = plans.filter(
        (plan) => plan.inOrOutbound === 'Outbound'
      ).length;
      this.completedPlansCount = plans.filter(
        (plan) => plan.planStatus === '已完成'
      ).length;
      this.pendingPlansCount = plans.filter(
        (plan) => plan.planStatus === '未完成'
      ).length;

      // Retrieve the date and quantity of inbound and outbound plans
      const inboundPlanData = this.aggregateByDay(
        plans.filter((plan) => plan.inOrOutbound === 'Inbound')
      );
      const outboundPlanData = this.aggregateByDay(
        plans.filter((plan) => plan.inOrOutbound === 'Outbound')
      );

      // Update Chart
      this.updateChartData(inboundPlanData, outboundPlanData);
    });
  }

  ngOnInit(): void {
    this.getData();
    setInterval(() => {
      if (this.planService.updatePlan) {
        this.getData();
        this.planService.updatePlan = false;
      }
    }, 1000);
  }

  // Aggregate plans by day
  aggregateByDay(plans: any[]): any[] {
    const aggregateData: { [key: string]: number } = {};
    plans.forEach((plan) => {
      const day = new Date(plan.planExpectedTime).toLocaleDateString('zh-CN', {
        timeZone: 'UTC',
      });
      if (aggregateData[day]) {
        aggregateData[day] += plan.planExpectedAmount;
      } else {
        aggregateData[day] = plan.planExpectedAmount;
      }
    });
    return Object.entries(aggregateData).map(([day, amount]) => ({
      day,
      amount,
    }));
  }

  // Update Chart
  updateChartData(inboundPlanData: any[], outboundPlanData: any[]): void {
    this.totalPlansCount = this.plans.length;
    // Merge inbound and outbound dates, and sort by date
    const allDays = [
      ...inboundPlanData.map((data) => data.day),
      ...outboundPlanData.map((data) => data.day),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.options1 = {
      title: {
        text: '出入库计划比例',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '计划类型',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.inboundPlansCount, name: '入库计划' },
            { value: this.outboundPlansCount, name: '出库计划' },
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

    this.options2 = {
      title: {
        text: '计划状态',
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
          name: '计划状态',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.completedPlansCount, name: '已完成' },
            { value: this.pendingPlansCount, name: '未完成' },
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
        text: '计划吞吐量',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['计划入库量', '计划出库量'],
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
          name: '计划入库量',
          data: allDays.map((day) => {
            const foundData = inboundPlanData.find((data) => data.day === day);
            return foundData ? foundData.amount : 0;
          }),
          type: 'line',
        },
        {
          name: '计划出库量',
          data: allDays.map((day) => {
            const foundData = outboundPlanData.find((data) => data.day === day);
            return foundData ? foundData.amount : 0;
          }),
          type: 'line',
        },
      ],
    };
  }
}
