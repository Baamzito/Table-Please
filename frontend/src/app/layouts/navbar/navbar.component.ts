import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: any = null;

  constructor(private router: Router, private authService: AuthService, private userService: UserService){}

  getUser(){
    if (this.isLoggedIn() && this.user == null) {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  isCustomer(){
    return this.user && this.user.role === 'customer';
  }

  logout(){
    this.user = null;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
