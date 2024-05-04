import { Component } from '@angular/core';
import { AuthService } from '../../auth-service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    this.authService.getAuthenticatedSub().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
