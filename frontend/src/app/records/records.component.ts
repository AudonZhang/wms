import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RecordService } from '../services/record.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent implements OnInit {
  totalRecordsCount = 0;
  inboundOrdersCount?: number;
  outboundOrdersCount?: number;
  options1: any; // Inbound and Outbound Ratio Chart
  options2: any; // Line chart of Inbound and Outbound time and quantity
  inboundData: {
    day: string;
    amount: string;
  }[] = [];
  outboundData: {
    day: string;
    amount: string;
  }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordService
  ) {
    // When entering the subpage, hide the content of that page
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
    this.totalRecordsCount = 0;
    this.recordsService.getAllInbounds().subscribe((records) => {
      this.inboundOrdersCount = records.length;
      this.totalRecordsCount += this.inboundOrdersCount;
      this.inboundData = this.aggregateByDayIn(records);
      this.recordsService.getAllOutbounds().subscribe((records) => {
        this.outboundOrdersCount = records.length;
        this.totalRecordsCount += this.outboundOrdersCount;
        this.outboundData = this.aggregateByDayOut(records);
        this.updateChartData(this.inboundData, this.outboundData);
      });
    });
  }

  aggregateByDayIn(records: any[]): any[] {
    const aggregateData: { [key: string]: number } = {};
    records.forEach((records) => {
      const day = new Date(records.inboundUpdatedTime).toLocaleDateString(
        'en-US',
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

  aggregateByDayOut(records: any[]): any[] {
    const aggregateData: { [key: string]: number } = {};
    records.forEach((records) => {
      const day = new Date(records.outboundUpdatedTime).toLocaleDateString(
        'en-US',
        { timeZone: 'UTC' }
      );
      console.log(day);
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

  ngOnInit(): void {
    this.getData();
    setInterval(() => {
      if (this.recordsService.afterModifyChart) {
        this.getData();
        this.recordsService.afterModifyChart = false;
      }
    }, 1000);
  }
  updateChartData(inboundData: any[], outboundData: any[]): void {
    // Merge inbound and outbound date data, and sort by date
    const allDays = [
      ...inboundData.map((data) => data.day),
      ...outboundData.map((data) => data.day),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.options1 = {
      title: {
        text: '出入库记录',
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
          name: '出入库类型',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.inboundOrdersCount, name: '入库记录' },
            { value: this.outboundOrdersCount, name: '出库记录' },
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
        text: '吞吐量',
        left: 'center',
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
}
