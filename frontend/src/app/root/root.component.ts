import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
})
export class RootComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
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
}
