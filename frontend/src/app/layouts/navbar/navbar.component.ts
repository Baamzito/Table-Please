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
export class NavbarComponent implements OnInit{
  user: any = null;

  constructor(private router: Router, private authService: AuthService, private userService: UserService){}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    if (this.isLoggedIn()) {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.user = user;
          console.log(user)
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

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
