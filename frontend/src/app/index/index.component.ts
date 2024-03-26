import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    // 订阅路由事件以确保子路由变化时检查当前路由
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isChildRouteActive();
      });
  }

  // 检查当前是否为子路由页面
  isChildRouteActive(): boolean {
    return this.route.children.length > 0;
  }
}
