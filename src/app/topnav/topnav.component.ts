import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartIconComponent } from '../cart/cart-icon/cart-icon.component';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule, CartIconComponent],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css',
})
export class TopnavComponent {
  isLoggedIn: boolean = false;
  currentRoute: string = '';
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
