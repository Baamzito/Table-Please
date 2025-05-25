import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: any = {};

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userService.getUser().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  logout() {
    this.authService.logout();
  }

}
