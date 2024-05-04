import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the isAuthenticated observable to get real-time authentication status updates
    this.authListenerSubs = this.authService.getIsAuthenticated()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;  // Update the local isAuthenticated variable based on the stream
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable when the component is destroyed to prevent memory leaks
    if (this.authListenerSubs) {
      this.authListenerSubs.unsubscribe();
    }
  }

  onLogout(): void {
    // Log out the user using AuthService and navigate to login page as defined in AuthService
    this.authService.logout();
  }
}
