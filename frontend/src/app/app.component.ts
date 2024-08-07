import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  userID?: string;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Synchronize login status every second
    setInterval(() => {
      this.userID = this.userService.loginID;
    }, 1000);
  }
}
